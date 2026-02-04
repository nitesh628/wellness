import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// --- Types ---
interface Appointment {
  time: string;
  patient: string;
  type: string;
  status: string;
  specialization: string;
}

interface Prescription {
  patient: string;
  medication: string;
  dosage: string;
  date: string;
  status: string;
}

interface DashboardData {
  stats: {
    todayAppointments: number;
    totalPatients: number;
    prescriptionsCount: number;
    consultationFee: number;
    rating: number;
    experience: string;
  };
  todaysAppointments: Appointment[];
  recentPrescriptions: Prescription[];
  doctorName?: string;
}

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
};

// Helper for Auth Headers
const getAuthConfig = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  return {
    withCredentials: true,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    },
  };
};

const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/dashboard/doctor`;

// --- Thunk ---
export const fetchDoctorDashboard = createAsyncThunk(
  "dashboard/fetchDoctor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, getAuthConfig());
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data",
      );
    }
  },
);

// --- Slice ---
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchDoctorDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// --- Selectors ---
export const selectDashboardData = (state: RootState) => state.dashboard.data;
export const selectDashboardLoading = (state: RootState) =>
  state.dashboard.isLoading;
export const selectDashboardError = (state: RootState) => state.dashboard.error;

export default dashboardSlice.reducer;
