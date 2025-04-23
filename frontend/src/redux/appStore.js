import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import bookedSeatsReducer from './bookedSeatsSlice';
import configSeatsReducer from './configSeatsSlice';

// ✅ Load state from localStorage
const loadState = () => {
  try {
    const serialized = localStorage.getItem('trainTixState');
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

// ✅ Save state to localStorage
const saveState = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem('trainTixState', serialized);
  } catch {}
};

const appStore = configureStore({
  reducer: {
    user: userReducer,
    allBookedSeats: bookedSeatsReducer,
    seatConfig: configSeatsReducer
  },
  preloadedState: loadState() 
});

// ✅ Subscribe to store change
appStore.subscribe(() => {
  saveState({
    user: appStore.getState().user,
    allBookedSeats: appStore.getState().allBookedSeats
  });
});

export default appStore;

