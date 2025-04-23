// utils/seatConfigSlice.js
import { createSlice } from '@reduxjs/toolkit';

const configSeatsSlice = createSlice({
  name: 'seatConfig',
  initialState: {
    totalSeats: 80,
    seatsPerRow: 7,
    seatPrice:100,
  },
  reducers: {
    updateSeatConfig: (state, action) => {
      state.totalSeats = action.payload.totalSeats;
      state.seatsPerRow = action.payload.seatsPerRow;
      state.seatPrice = action.payload.seatPrice;
    }
  }
});

export const { updateSeatConfig } = configSeatsSlice.actions;
export default configSeatsSlice.reducer;
