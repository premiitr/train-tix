import React from 'react';
import { useSelector } from 'react-redux';

const SeatLayout = ({ totalSeats, seatsPerRow, currSeats}) => {
  const user = useSelector((state) => state.user);
  const allBookedSeats = useSelector((state)=>state.allBookedSeats);

  const fullRows = Math.floor(totalSeats / seatsPerRow);
  const remainingSeats = totalSeats % seatsPerRow;
  const totalBooked = allBookedSeats.length;
  const totalAvailable = totalSeats - totalBooked;

  const getSeatColor = (seatId) => {
    const isBookedByUser = user.isLoggedIn && (user.bookedSeats.includes(seatId) || currSeats.includes(seatId));
    const isBookedByOthers = allBookedSeats.includes(seatId) && !isBookedByUser;

    if (!user.isLoggedIn) {
      return allBookedSeats.includes(seatId) ? 'bg-red-400 border-red-600' : 'bg-green-500 border-green-600';
    }
    if (isBookedByUser) return 'bg-yellow-300 border-yellow-500';
    if (isBookedByOthers) return 'bg-red-400 border-red-600';
    return 'bg-green-500 border-green-600';
  };

  const generateRow = (rowIndex, seatsInRow) => (
    <div key={rowIndex} className='flex items-center'>
      <div className='w-[50px] h-[40px] flex items-center justify-center font-semibold bg-sky-300 text-white rounded-md shadow-sm'>
        {rowIndex + 1}
      </div>
      {[...Array(seatsInRow)].map((_, cidx) => {
        const seatId = `${rowIndex + 1}${String.fromCharCode(65 + cidx)}`;
        const seatColor = getSeatColor(seatId);

        return (
          <div key={seatId} className={`w-[50px] h-[40px] m-2 flex items-center justify-center font-medium text-gray-700 cursor-pointer border rounded-lg shadow-md hover:scale-95 transition ${seatColor}`}>
            {seatId}
          </div>
        );
      })}
      {seatsInRow < seatsPerRow &&
      [...Array(seatsPerRow - seatsInRow)].map((_, idx) => (
        <div key={`empty-${idx}`} className="w-[50px] h-[40px] m-2 opacity-0"></div>
      ))}
    </div>
  );

  return (
    <div>
      <div className='my-3 max-h-[500px] lg:h-[510px] bg-white rounded-xl shadow-xl overflow-auto no-scrollbar border border-gray-200'>
        <div className='sticky top-0 z-10 bg-gradient-to-r from-sky-300 via-indigo-400 to-slate-500 flex items-center rounded-t-md shadow-md'>
          <div className='w-[50px] h-[40px]' />
          {[...Array(seatsPerRow)].map((_, idx) => (
            <div key={idx} className='w-[50px] h-[40px] mx-2 flex items-center justify-center font-bold text-white'>
              {String.fromCharCode(65 + idx)}
            </div>
          ))}
        </div>
        <div className='flex flex-col w-full overflow-x-auto'>
          {[...Array(fullRows)].map((_, rowIndex) => generateRow(rowIndex, seatsPerRow))}
          {remainingSeats > 0 && generateRow(fullRows, remainingSeats)}
        </div>

      </div>

      <div className='flex gap-3 justify-between mt-2'>
        <span className='p-3 w-[180px] bg-red-300 font-bold flex justify-between border border-red-700 rounded-full shadow-md'>
          <span className='mx-auto'>Booked Seats</span>
          <span className='mx-auto'>{totalBooked}</span>
        </span>
        <span className='p-3 w-[180px] bg-green-300 font-bold flex justify-between border border-green-700 rounded-full shadow-md'>
          <span className='mx-auto'>Available Seats</span>
          <span className='mx-auto'>{totalAvailable}</span>
        </span>
      </div>
    </div>
  );
};

export default SeatLayout;
