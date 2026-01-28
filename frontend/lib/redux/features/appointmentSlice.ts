import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import axios from "axios";

// --- Interfaces ---

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

// The shape of data coming FROM the API
interface ApiAppointment {
  _id: string;
  patient: User | string;
  doctor: User | string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number;
  type: "consultation" | "follow-up" | "emergency" | "checkup";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  reason: string;
  notes?: string;
  location?: string;
  fee: number;
  paymentStatus: "pending" | "paid" | "refunded";
  createdAt: string;
  updatedAt: string;
}

// The shape of data used in the UI
// Renamed from UIAppointment to Appointment to match Page Component import
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAvatar: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: string;
  reason: string;
  notes: string;
  doctor: string;
  location: string;
  fee: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface AppointmentState {
  data: Appointment[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

const initialState: AppointmentState = {
  data: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// --- Helper for Auth Headers ---
const getAuthConfig = () => {
  // Added window check for Next.js SSR safety
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

// --- Helper to map API response to UI format ---
const mapApiToUI = (apiAppt: ApiAppointment): Appointment => {
  const patientObj =
    typeof apiAppt.patient === "object" ? apiAppt.patient : null;
  const doctorObj = typeof apiAppt.doctor === "object" ? apiAppt.doctor : null;

  return {
    id: apiAppt._id,
    patientId: patientObj ? patientObj._id : (apiAppt.patient as string),
    patientName: patientObj
      ? `${patientObj.firstName} ${patientObj.lastName}`
      : "Unknown",
    patientEmail: patientObj ? patientObj.email : "",
    patientPhone: patientObj?.phone || "",
    patientAvatar: patientObj?.avatar || "",
    date: new Date(apiAppt.appointmentDate).toISOString().split("T")[0],
    time: apiAppt.appointmentTime,
    duration: apiAppt.duration,
    type: apiAppt.type,
    status: apiAppt.status,
    reason: apiAppt.reason,
    notes: apiAppt.notes || "",
    doctor: doctorObj
      ? `${doctorObj.firstName} ${doctorObj.lastName}`
      : "Unknown Doctor",
    location: apiAppt.location || "Online",
    fee: apiAppt.fee,
    paymentStatus: apiAppt.paymentStatus,
    createdAt: apiAppt.createdAt,
    updatedAt: apiAppt.updatedAt,
  };
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setAppointments: (
      state,
      action: PayloadAction<{ data: Appointment[]; total: number }>
    ) => {
      state.data = action.payload.data;
      state.pagination.total = action.payload.total;
      state.isLoading = false;
    },
    addAppointmentToList: (state, action: PayloadAction<Appointment>) => {
      state.data.unshift(action.payload);
      state.pagination.total += 1;
      state.isLoading = false;
    },
    updateAppointmentInList: (state, action: PayloadAction<Appointment>) => {
      const index = state.data.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) state.data[index] = action.payload;
      state.isLoading = false;
    },
    removeAppointmentFromList: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((a) => a.id !== action.payload);
      state.pagination.total -= 1;
      state.isLoading = false;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setAppointments,
  addAppointmentToList,
  updateAppointmentInList,
  removeAppointmentFromList,
  setPage,
} = appointmentSlice.actions;

// --- Async Thunks ---

export const fetchAppointments =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoading());
    try {
      const { page, limit } = getState().appointments.pagination;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments?page=${page}&limit=${limit}`,
        getAuthConfig()
      );

      if (response.data.success) {
        const uiData = response.data.data.map((item: ApiAppointment) =>
          mapApiToUI(item)
        );
        dispatch(
          setAppointments({
            data: uiData,
            total: response.data.pagination?.total || uiData.length,
          })
        );
      }
    } catch (error: any) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to fetch appointments"
        )
      );
    }
  };

export const createAppointment =
  (formData: any) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const payload = {
        ...formData,
        appointmentDate: formData.date,
        appointmentTime: formData.time,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`,
        payload,
        getAuthConfig()
      );

      if (response.data.success) {
        dispatch(addAppointmentToList(mapApiToUI(response.data.data)));
        return true;
      }
    } catch (error: any) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to create appointment"
        )
      );
      return false;
    }
  };

export const updateAppointment =
  (id: string, formData: any) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const payload = {
        ...formData,
        ...(formData.date && { appointmentDate: formData.date }),
        ...(formData.time && { appointmentTime: formData.time }),
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${id}`,
        payload,
        getAuthConfig()
      );

      if (response.data.success) {
        dispatch(updateAppointmentInList(mapApiToUI(response.data.data)));
        return true;
      }
    } catch (error: any) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to update appointment"
        )
      );
      return false;
    }
  };

export const deleteAppointment =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${id}`,
        getAuthConfig()
      );

      if (response.data.success) {
        dispatch(removeAppointmentFromList(id));
        return true;
      }
    } catch (error: any) {
      dispatch(
        setError(
          error.response?.data?.message || "Failed to delete appointment"
        )
      );
      return false;
    }
  };

// --- Selectors ---
// Using RootState ensures TypeScript knows 'appointments' exists in the store
export const selectAppointments = (state: RootState) => state.appointments.data;
export const selectApptLoading = (state: RootState) =>
  state.appointments.isLoading;
export const selectApptPagination = (state: RootState) =>
  state.appointments.pagination;

export default appointmentSlice.reducer;
