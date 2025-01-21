import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import reportsReducer from './slices/reportsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    reports: reportsReducer,
    dashboard: dashboardReducer
  }
});