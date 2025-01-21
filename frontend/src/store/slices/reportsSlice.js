import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReportData = createAsyncThunk(
  'reports/fetchReportData',
  async (reportType, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportType}`);
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    userStats: {},
    jobStats: {},
    platformAnalytics: {},
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state[action.meta.arg] = action.payload;
        state.loading = false;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default reportsSlice.reducer;
