import { createSlice } from "@reduxjs/toolkit";

const bookedSeatsSlice = createSlice({
  name: 'allBookedSeats',
  initialState: [],
  reducers: {
    addBookedSeats: (state, action) => {
      return [...new Set([...state, ...action.payload])];
    },
    removeBookedSeats: (state, action) => {
      return state.filter(seat => !action.payload.includes(seat));  // ✅ REMOVE
    },
    setBookedSeats: (state, action) => {
      return [...new Set(action.payload)];
    },
    resetBookedSeats: () => []
  }
});

export const { addBookedSeats, removeBookedSeats,setBookedSeats, resetBookedSeats } = bookedSeatsSlice.actions;
export default bookedSeatsSlice.reducer;

