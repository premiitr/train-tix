import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetBookedSeats } from '../utils/bookedSeatsSlice';
import { updateBookedSeats, setCurrentSessionSeats } from '../utils/userSlice';
import { API_URL } from '../utils/constants';
import { updateSeatConfig } from '../utils/configSeatsSlice';
import PromptBox from './PromptBox';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const seatConfig = useSelector((state) => state.seatConfig);

  const [totalSeatsInput, setTotalSeatsInput] = useState(seatConfig.totalSeats);
  const [seatsPerRowInput, setSeatsPerRowInput] = useState(seatConfig.seatsPerRow);
  const [seatPriceInput, setSeatPriceInput] = useState(seatConfig.seatPrice || 0);

  const [promptMsg, setPromptMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const showPrompt = (msg) => {
    setPromptMsg(msg);
    setTimeout(() => setPromptMsg(''), 3000);
  };

  const handleConfigUpdate = () => {
    if (totalSeatsInput < 1 || seatsPerRowInput < 1 || seatPriceInput < 0) {
      showPrompt('error:Invalid configuration values');
      return;
    }

    dispatch(updateSeatConfig({
      totalSeats: Number(totalSeatsInput),
      seatsPerRow: Number(seatsPerRowInput),
      seatPrice: Number(seatPriceInput),
    }));

    showPrompt('success:✅ Seat configuration updated!');
  };

  const handleResetAllBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/reset_all/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(resetBookedSeats());
        dispatch(updateBookedSeats([]));
        dispatch(setCurrentSessionSeats([]));
        setShowConfirm(false);
        showPrompt('success:✅ All bookings have been successfully reset!');
      } else {
        showPrompt(`error:${data.error}`);
      }
    } catch (err) {
      showPrompt('error:Server error while resetting');
    }
  };

  return (
    <div className="w-full lg:w-7/12 h-[600px] my-3 bg-white border border-gray-200 flex justify-center rounded-xl shadow-xl p-6">
      <div className="w-10/12 flex flex-col justify-center items-center gap-6">
        {promptMsg && <PromptBox message={promptMsg} onClose={() => setPromptMsg('')} />}
        <h2 className="text-3xl font-bold text-indigo-700">🛠️ Admin Panel</h2>
        <div className="w-full flex flex-col gap-3">
          <div className="flex w-full gap-2 max-w-sm mx-auto items-center">
            <label className="text-md font-medium text-gray-700 w-32">Total Seats</label>
            <input type="number" value={totalSeatsInput} onChange={(e) => setTotalSeatsInput(e.target.value)}
              className="flex-1 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
          </div>

          <div className="flex w-full gap-2 max-w-sm mx-auto items-center">
            <label className="text-md font-medium text-gray-700 w-32">Seats/Row</label>
            <input type="number" value={seatsPerRowInput} onChange={(e) => setSeatsPerRowInput(e.target.value)}
              className="flex-1 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
          </div>

          <div className="flex w-full gap-2 max-w-sm mx-auto items-center">
            <label className="text-md font-medium text-gray-700 w-32">Price (₹)</label>
            <input type="number" value={seatPriceInput} onChange={(e) => setSeatPriceInput(e.target.value)}
              className="flex-1 px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"/>
          </div>

          <div className="flex w-full max-w-sm mx-auto">
            <button onClick={handleConfigUpdate}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition">
              ✅ Update Configuration
            </button>
          </div>
        </div>


        <p className="text-center text-gray-600 text-sm">
          You can manage system-wide bookings here. Use the button below to reset all booked seats.
        </p>

        <button onClick={() => setShowConfirm(true)}
          className="bg-red-400 text-white px-6 py-3 font-semibold text-sm rounded-lg shadow-md hover:bg-red-500 transition">
          🧨 Reset All Bookings
        </button>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl text-center">
              <h3 className="text-xl font-bold text-red-600 mb-4">⚠️ Confirm Reset</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to reset <strong>all bookings</strong>? This action affects all users and
                cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 bg-gray-200 rounded-md font-semibold text-gray-700 hover:bg-gray-300 transition"
                >
                  ❌ Cancel
                </button>
                <button onClick={handleResetAllBookings}
                  className="px-5 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition">
                  🧨 Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
