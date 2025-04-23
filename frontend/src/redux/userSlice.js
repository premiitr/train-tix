import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: '',
    user_id: null,
    bookedSeats: [], // permanent bookings
    currentSessionSeats: [], // 🟡 new
    isLoggedIn: false,
  },
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.user_id = action.payload.user_id;
      state.bookedSeats = action.payload.bookedSeats || [];
      state.isLoggedIn = true;
    },
    
    logout: (state) => {
      state.name = '';
      state.email = '';
      state.user_id = null;
      state.bookedSeats = [];
      state.currentSessionSeats = [];
      state.isLoggedIn = false;
    },

    addUserBookedSeats: (state, action) => {
      const newSeats = action.payload;
      state.bookedSeats = [...new Set([...state.bookedSeats, ...newSeats])];
    },

    removeUserBookedSeats: (state, action) => {
      const seatsToRemove = action.payload;
      state.bookedSeats = state.bookedSeats.filter(seat => !seatsToRemove.includes(seat));
    },
    updateBookedSeats: (state, action) => {
      state.bookedSeats = action.payload;
    },

    setCurrentSessionSeats: (state, action) => {
      state.currentSessionSeats = action.payload;
    },
  }
});

export const {login,logout,addUserBookedSeats,removeUserBookedSeats,updateBookedSeats,setCurrentSessionSeats} = userSlice.actions;
export default userSlice.reducer;

