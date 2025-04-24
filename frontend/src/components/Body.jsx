import React, { useEffect, useState } from 'react';
import SeatLayout from './SeatLayout';
import BookingPanel from './BookingPanel';
import { useDispatch, useSelector } from 'react-redux';
import { addUserBookedSeats, updateBookedSeats } from '../redux/userSlice';
import { addBookedSeats, setBookedSeats } from '../redux/bookedSeatsSlice';
import { API_URL } from '../utils/constants';
import AdminPanel from './AdminPanel';
import PromptBox from './PromptBox';

const Body = () => {
  const { totalSeats, seatsPerRow } = useSelector((state) => state.seatConfig);
  const [promptMsg, setPromptMsg] = useState("");
  const [currSeats, setcurrSeats] = useState([]);

  const showPrompt = (msg) => {
    setPromptMsg(msg);
    setTimeout(() => setPromptMsg(""), 3000);
  };


  const user = useSelector((state) => state.user);
  const allBookedSeats = useSelector((state) => state.allBookedSeats);
  const dispatch = useDispatch();
  
  // Sync booked seats from backend
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await fetch(`${API_URL}/booked_seats/`);
        const data = await res.json();
        dispatch(setBookedSeats(data.booked_seats));
        const updated = user.bookedSeats.filter(seat => data.booked_seats.includes(seat));
        if (updated.length !== user.bookedSeats.length) {
          dispatch(updateBookedSeats(updated));
        }
      } catch (err) {
        console.error("Failed to fetch seats:", err);
      }
    };

    fetchSeats();
    const interval = setInterval(fetchSeats, 5000);
    return () => clearInterval(interval);
  }, [dispatch, user.bookedSeats]);

  const getAllSeatIds = () => {
    const seatMap = [];
    const fullRows = Math.floor(totalSeats / seatsPerRow);
    const remaining = totalSeats % seatsPerRow;

    for (let r = 1; r <= fullRows; r++) {
      for (let c = 0; c < seatsPerRow; c++) {
        seatMap.push(`${r}${String.fromCharCode(65 + c)}`);
      }
    }
    for (let c = 0; c < remaining; c++) {
      seatMap.push(`${fullRows + 1}${String.fromCharCode(65 + c)}`);
    }
    return seatMap;
  };

  const getClosestNSeats = (availableSeats, n) => {
  if (availableSeats.length < n) return [];

  const seatToCoords = (seatId) => {
    const row = parseInt(seatId.match(/\d+/)[0]);
    const col = seatId.charCodeAt(seatId.length - 1) - 65;
    return { seatId, row, col };
  };

  const coords = availableSeats.map(seatToCoords);

  // Group by row
  const rowMap = {};
  for (const seat of coords) {
    if (!rowMap[seat.row]) rowMap[seat.row] = [];
    rowMap[seat.row].push(seat);
  }

  const sortedRows = Object.keys(rowMap).map(Number).sort((a, b) => a - b);

  let bestCombo = [];
  let bestMetrics = { rowSpan: Infinity, colSpan: Infinity, distance: Infinity };

  for (let centerRow of sortedRows) {
    const baseRowSeats = rowMap[centerRow].sort((a, b) => a.col - b.col);
    const maxFromBase = Math.min(baseRowSeats.length, n);

    for (let countFromBase = maxFromBase; countFromBase >= 1; countFromBase--) {
      const selected = [...baseRowSeats.slice(0, countFromBase)];
      let remaining = n - countFromBase;

      // Now find a row (preferably) with exactly `remaining` seats
      const otherRows = sortedRows.filter(r => r !== centerRow);
      let additional = [];

      const exactMatchRow = otherRows
        .filter(r => rowMap[r].length === remaining)
        .sort((a, b) => Math.abs(a - centerRow) - Math.abs(b - centerRow))[0];

      if (exactMatchRow !== undefined) {
        additional = rowMap[exactMatchRow].slice(0, remaining);
      } else {
        // Fallback: choose closest rows with enough total seats
        for (let row of otherRows.sort((a, b) => Math.abs(a - centerRow) - Math.abs(b - centerRow))) {
          if (remaining <= 0) break;
          const take = rowMap[row].slice(0, remaining);
          additional.push(...take);
          remaining -= take.length;
        }
      }

      if (selected.length + additional.length < n) continue;

      const combo = [...selected, ...additional];
      const rowSet = new Set(combo.map(s => s.row));
      const colVals = combo.map(s => s.col);
      const rowSpan = Math.max(...rowSet) - Math.min(...rowSet);
      const colSpan = Math.max(...colVals) - Math.min(...colVals);
      const distance = combo.reduce((acc, s1) =>
        acc + combo.reduce((inner, s2) =>
          inner + Math.abs(s1.row - s2.row) + Math.abs(s1.col - s2.col), 0), 0);

      const isBetter =
        rowSpan < bestMetrics.rowSpan ||
        (rowSpan === bestMetrics.rowSpan && colSpan < bestMetrics.colSpan) ||
        (rowSpan === bestMetrics.rowSpan && colSpan === bestMetrics.colSpan && distance < bestMetrics.distance);

      if (isBetter) {
        bestCombo = combo.map(s => s.seatId);
        bestMetrics = { rowSpan, colSpan, distance };
      }
    }
  }

  return bestCombo;
};

  
  const handleBook = async (count) => {
    if (!user.isLoggedIn) return showPrompt('Please login to book seats');
    if (count < 1 || count > 7) return showPrompt('You can book up to 7 seats at a time.');

  
    const seatMap = getAllSeatIds();
    const available = seatMap.filter(seat => !allBookedSeats.includes(seat));
    if (available.length < count) return showPrompt('Not enough seats available!');
  
    let selected = [];
  
    // Try to find contiguous first
    const rowMap = {};
    available.forEach(seat => {
      const row = seat.match(/\d+/)[0];
      if (!rowMap[row]) rowMap[row] = [];
      rowMap[row].push(seat);
    });
  
    const sortedRows = Object.keys(rowMap).sort((a, b) => +a - +b);
  
    for (let row of sortedRows) {
      const seats = rowMap[row].sort((a, b) => a.charCodeAt(a.length - 1) - b.charCodeAt(b.length - 1));
      for (let i = 0; i <= seats.length - count; i++) {
        const chunk = seats.slice(i, i + count);
        const contiguous = chunk.every((seat, idx) => {
          if (idx === 0) return true;
          return chunk[idx - 1].slice(-1).charCodeAt(0) + 1 === seat.slice(-1).charCodeAt(0);
        });
        if (contiguous) {
          selected = chunk;
          break;
        }
      }
      if (selected.length) break;
    }
  
    if (!selected.length) selected = getClosestNSeats(available,count);
  
    // only dispatch after server confirms
    try {
      const res = await fetch(`${API_URL}/book/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, seats: selected })
      });

      const data = await res.json();
      if (res.ok) {
        setcurrSeats(selected);
        dispatch(addUserBookedSeats(selected));
        dispatch(addBookedSeats(selected));
      } else {
        showPrompt(data.error || "Booking failed");
      }
    } catch (err) {
      showPrompt("Server error while booking");
    }
  };
  

  return (
    <div className='w-11/12 my-6 max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-4 justify-between'>
      {promptMsg && <PromptBox message={promptMsg} onClose={() => setPromptMsg("")} />}
      <SeatLayout totalSeats={totalSeats} seatsPerRow={seatsPerRow} currSeats={currSeats} />
      {user.email === 'admin@traintix.com' ? (
        <AdminPanel setcurrSeats={setcurrSeats}/> 
      ) : (
        <BookingPanel onBook={handleBook} currSeats={currSeats} setcurrSeats={setcurrSeats}/>
      )}
    </div>
  );
};

export default Body;
