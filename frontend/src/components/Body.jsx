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
    for (let seat of coords) {
      if (!rowMap[seat.row]) rowMap[seat.row] = [];
      rowMap[seat.row].push(seat);
    }
  
    const sortedRows = Object.keys(rowMap).map(Number).sort((a, b) => a - b);
  
    let bestCombo = [];
    let bestRowSpan = Infinity;
    let bestColSpan = Infinity;
    let bestDistance = Infinity;
  
    for (let i = 0; i < sortedRows.length; i++) {
      const centerRow = sortedRows[i];
      let remaining = n;
      let selectedSeats = [];
  
      const initial = rowMap[centerRow].sort((a, b) => a.col - b.col);
      selectedSeats.push(...initial.slice(0, Math.min(remaining, initial.length)));
      remaining = n - selectedSeats.length;
  
      const remainingRows = sortedRows.filter(r => r !== centerRow);
      const exactMatchRows = remainingRows.filter(r => rowMap[r].length === remaining);
      const fallbackRows = remainingRows.filter(r => rowMap[r].length !== remaining);
  
      const prioritizedRows = [...exactMatchRows, ...fallbackRows].sort(
        (a, b) => Math.abs(a - centerRow) - Math.abs(b - centerRow)
      );
  
      for (let r of prioritizedRows) {
        if (remaining <= 0) break;
        const seats = rowMap[r].sort((a, b) => a.col - b.col);
        const pick = seats.slice(0, remaining);
        selectedSeats.push(...pick);
        remaining -= pick.length;
      }
  
      if (selectedSeats.length < n) continue;
  
      const rowSet = new Set(selectedSeats.map(s => s.row));
      const colVals = selectedSeats.map(s => s.col);
      const minCol = Math.min(...colVals);
      const maxCol = Math.max(...colVals);
      const rowSpan = Math.max(...rowSet) - Math.min(...rowSet);
      const colSpan = maxCol - minCol;
  
      const distance = selectedSeats.reduce((acc, s1) =>
        acc + selectedSeats.reduce((inner, s2) =>
          inner + Math.abs(s1.row - s2.row) + Math.abs(s1.col - s2.col), 0), 0);
  
      if (
        rowSpan < bestRowSpan ||
        (rowSpan === bestRowSpan && colSpan < bestColSpan) ||
        (rowSpan === bestRowSpan && colSpan === bestColSpan && distance < bestDistance)
      ) {
        bestCombo = selectedSeats.map(s => s.seatId);
        bestRowSpan = rowSpan;
        bestColSpan = colSpan;
        bestDistance = distance;
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
