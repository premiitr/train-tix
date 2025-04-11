import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetBookedSeats } from '../utils/bookedSeatsSlice';
import { updateBookedSeats, setCurrentSessionSeats } from '../utils/userSlice';
import { API_URL } from '../utils/constants';

const AdminPanel = () => {
    const user = useSelector((state)=>(state.user))
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetAllBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/reset_all/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id })
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(resetBookedSeats());              // reset all booked seats globally
        dispatch(updateBookedSeats([]));           // reset user's booked seats
        dispatch(setCurrentSessionSeats([]));      // reset session seats
        setShowConfirm(false);
        alert("✅ All bookings have been successfully reset!");
      } else {
        alert(data.error || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error while resetting");
    }
  };

  return (
    <div className='w-full lg:w-7/12 h-[570px] my-3 bg-white border border-gray-200 flex justify-center rounded-xl shadow-xl p-6'>
      <div className='w-10/12 flex flex-col justify-center items-center gap-6'>
        <h2 className='text-3xl font-bold text-indigo-700'>🛠️ Admin Panel</h2>
        <p className='text-center text-gray-600 text-sm'>
          You can manage system-wide bookings here. Use the button below to reset all booked seats.
        </p>

        <button
          onClick={() => setShowConfirm(true)}
          className='bg-red-400 text-white px-6 py-3 font-semibold text-sm rounded-lg shadow-md hover:bg-red-500 transition'>
          🧨 Reset All Bookings
        </button>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl text-center">
              <h3 className="text-xl font-bold text-red-600 mb-4">⚠️ Confirm Reset</h3>
              <p className="text-gray-700 mb-6">Are you sure you want to reset <strong>all bookings</strong>? This action affects all users and cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 bg-gray-200 rounded-md font-semibold text-gray-700 hover:bg-gray-300 transition">
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
