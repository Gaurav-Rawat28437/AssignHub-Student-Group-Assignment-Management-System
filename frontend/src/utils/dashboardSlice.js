
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyGroups,
  createGroup,
  addGroupMember,
  deleteGroup
} from "../services/groupService";

import {
  getMyAssignments,
  confirmAssignmentSubmission
} from "../services/assignmentService";

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
        groupCount: groupResponse.count || 0,
        assignmentCount: assignmentResponse.count || 0
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

export const createStudentGroup = createAsyncThunk(
  "dashboard/createStudentGroup",
  async (name, { rejectWithValue }) => {
    try {
      const response = await createGroup(name);
      const group = response.group;

      return {
        ...group,
        creator:
          group.members?.find(
            (member) => member.userId === group.createdById
          )?.user || null
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create group"
      );
    }
  }
);

export const addStudentGroupMember = createAsyncThunk(
  "dashboard/addStudentGroupMember",
  async ({ groupId, email }, { rejectWithValue }) => {
    try {
      const response = await addGroupMember(groupId, email);

      return {
        groupId,
        member: response.member
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add member"
      );
    }
  }
);

export const deleteStudentGroup = createAsyncThunk(
  "dashboard/deleteStudentGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      await deleteGroup(groupId);
      return groupId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete group"
      );
    }
  }
);

export const confirmAssignment = createAsyncThunk(
  "dashboard/confirmAssignment",
  async ({ assignmentId, groupId }, { rejectWithValue }) => {
    try {
      const response = await confirmAssignmentSubmission(
        assignmentId,
        groupId
      );

      return response.submission;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Submission confirmation failed"
      );
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
      })

      .addCase(createStudentGroup.fulfilled, (state, action) => {
        const group = action.payload;

        const alreadyExists = state.groups.some(
          (item) => item.id === group.id
        );

        if (!alreadyExists) {
          state.groups.unshift(group);
        }

        state.groupCount = state.groups.length;
      })

      .addCase(addStudentGroupMember.fulfilled, (state, action) => {
        const { groupId, member } = action.payload;

        const group = state.groups.find(
          (item) => item.id === groupId
        );

        if (group && member) {
          if (!group.members) {
            group.members = [];
          }

          const alreadyExists = group.members.some(
            (item) => item.userId === member.userId
          );

          if (!alreadyExists) {
            group.members.push(member);
          }
        }
      })

      .addCase(deleteStudentGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(
          (group) => group.id !== action.payload
        );

        state.groupCount = state.groups.length;
      })

      .addCase(confirmAssignment.fulfilled, (state, action) => {
        const submission = action.payload;

        const assignment = state.assignments.find(
          (item) => item.id === submission.assignmentId
        );

        if (assignment) {
          if (!assignment.submissions) {
            assignment.submissions = [];
          }

          const existingIndex = assignment.submissions.findIndex(
            (item) =>
              item.groupId === submission.groupId &&
              item.studentId === submission.studentId
          );

          if (existingIndex >= 0) {
            assignment.submissions[existingIndex] = submission;
          } else {
            assignment.submissions.push(submission);
          }
        }
      });
  }
});

export const { clearDashboardData } = dashboardSlice.actions;

export default dashboardSlice.reducer;
