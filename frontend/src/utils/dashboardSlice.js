
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getMyGroups } from "../services/groupService";
import { getMyAssignments } from "../services/assignmentService";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const [groupResponse, assignmentResponse] = await Promise.all([
        getMyGroups(),
        getMyAssignments()
      ]);

      return {
        groups: groupResponse.groups || [],
        assignments: assignmentResponse.assignments || [],
        groupCount: groupResponse.count,
        assignmentCount: assignmentResponse.count
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const status = getState().dashboard.status;

      return status !== "loading" && status !== "succeeded";
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    groups: [],
    assignments: [],
    groupCount: 0,
    assignmentCount: 0,
    status: "idle",
    error: null
  },

  reducers: {
    clearDashboardData: (state) => {
      state.groups = [];
      state.assignments = [];
      state.groupCount = 0;
      state.assignmentCount = 0;
      state.status = "idle";
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.groups = action.payload.groups;
        state.assignments = action.payload.assignments;
        state.groupCount = action.payload.groupCount;
        state.assignmentCount = action.payload.assignmentCount;
        state.status = "succeeded";
      })

      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { clearDashboardData } = dashboardSlice.actions;

export default dashboardSlice.reducer;
