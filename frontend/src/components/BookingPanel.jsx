import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { removeUserBookedSeats, setCurrentSessionSeats } from '../utils/userSlice';
import { removeBookedSeats } from '../utils/bookedSeatsSlice';
import PromptBox from './PromptBox';

const BookingPanel = ({ onBook }) => {
  const [seatCount, setSeatCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedToCancel, setSelectedToCancel] = useState([]);

  const [promptMsg, setPromptMsg] = useState("");
  
  const showPrompt = (msg) => {
    setPromptMsg(msg);
    setTimeout(() => setPromptMsg(""), 3000);
  };

  const modalRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const seatConfig = useSelector((state) => state.seatConfig);
  const currseats = user.currentSessionSeats;
  const userbookedseats = user.bookedSeats;

  // Define the price per seat (this can be adjusted or fetched from a config)
  const seatPrice = seatConfig.seatPrice; // Example price per seat

  const handleShowBookedSeats = () => {
    user.isLoggedIn ? setShowModal(true) : navigate('/login');
  };

  const toggleSeat = (seat) => {
    setSelectedToCancel((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleCancelSeats = async (seatsToCancel) => {
    if (seatsToCancel.length === 0) return;

    try {
      const res = await fetch(`${API_URL}/cancel/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, seats: seatsToCancel }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(removeUserBookedSeats(seatsToCancel));
        dispatch(removeBookedSeats(seatsToCancel));
        dispatch(setCurrentSessionSeats([]));
        setSelectedToCancel([]);
        setShowModal(false);
      } else {
        showPrompt(`error:${data} Cancel Failed`)
      }
    } catch (err) {
      showPrompt("error:Server error while cancelling")
    }
  };

  const handleCancelAll = () => {
    handleCancelSeats([...userbookedseats]);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setSelectedToCancel([]);
        setShowModal(false);
      }
    };
    if (showModal) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  return (
    <div className='w-full h-auto my-3 lg:h-[570px] bg-white border border-gray-200 flex justify-center rounded-xl shadow-xl p-4'>
      <div className='w-full lg:w-8/12 flex flex-col justify-center gap-4'>
        <div className='text-2xl font-bold text-center text-indigo-700'>Book Your Seats</div>
        {promptMsg && <PromptBox message={promptMsg} onClose={() => setPromptMsg("")} />}
        {currseats.length > 0 && (
          <div className="mx-auto px-2 py-2 flex gap-2 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-2">
              {currseats.map((seat) => (
                <span key={seat} className="px-2 py-1 bg-yellow-200 text-sm rounded-lg border border-yellow-400 shadow">
                  {seat}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex w-full gap-2 max-w-sm mx-auto">
          <input type="number" placeholder="Enter number of seats." value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"/>
          <button onClick={() => user.isLoggedIn ? onBook(seatCount) : navigate('/login')}
            className={`px-4 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-700 transition ${!user.isLoggedIn && 'opacity-50 cursor-not-allowed'}`}>
            Book
          </button>
        </div>

        <button onClick={handleShowBookedSeats}
          className='w-full max-w-sm mx-auto py-2 bg-indigo-500 text-white text-sm font-semibold rounded-md hover:bg-indigo-600 transition'>
          View My Booked Seats
        </button>

        {/* Total Price Box */}
        {currseats.length > 0 && (
          <div className="w-[385px] mx-auto p-2 bg-green-100 gap-4 flex justify-center rounded-md">
            <p className="text-lg font-semibold">Total Price : </p>
            <p className="text-lg font-bold text-green-600">{currseats.length * seatPrice} ₹</p>
          </div>
        )}
      </div>

      {/* 🔽 Cancel Modal */}
      {showModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div ref={modalRef} className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl">
            <h2 className="text-xl font-bold text-center text-white py-2 mb-4 rounded-md bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 shadow-md">
              🎟️ My Booked Seats
            </h2>

            {userbookedseats.length === 0 ? (
              <p className="text-sm text-gray-600 text-center">No seats booked yet.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-scroll no-scrollbar justify-center">
                  {userbookedseats.map((seat) => (
                    <span key={seat} onClick={() => toggleSeat(seat)}
                      className={`w-[50px] h-[40px] m-2 flex items-center justify-center font-medium text-gray-700 cursor-pointer border rounded-lg shadow-md hover:scale-95 transition ${
                        selectedToCancel.includes(seat)
                          ? 'bg-red-300 border-red-600'
                          : 'bg-yellow-200 border-yellow-500'
                      }`}>
                      {seat}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between mt-6 gap-2">
                  <button
                    onClick={() => handleCancelSeats(selectedToCancel)}
                    className="flex-1 py-2 bg-red-100 text-red-700 border border-red-300 font-semibold rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                    disabled={selectedToCancel.length === 0}>
                    ❌ Cancel Selected
                  </button>

                  <button
                    onClick={handleCancelAll}
                    className="flex-1 py-2 bg-orange-100 text-orange-700 border border-orange-300 font-semibold rounded-lg hover:bg-orange-200 transition"
                  >
                    ❌ Cancel All
                  </button>
                </div>

                <button
                  onClick={() => {setSelectedToCancel([]); setShowModal(false)}}
                  className="mt-4 w-full py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPanel;
