import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import axios from "axios";

// Define the Address type
export interface Address {
  _id?: string;
  user: string;
  addresses: [
    {
      name: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pinCode: string;
      landMark: string;
      isDefault: boolean;
      addressType: "Home" | "Work" | "Other";
      addressLabel?: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
}

// Define the state structure
interface AddressState {
  data: Address | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AddressState = {
  data: null,
  isLoading: false,
  error: null,
};

// Create the slice
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddressData: (state, action: PayloadAction<Address>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setAddressLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setAddressError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAddress: (state) => {
      state.data = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

// Export actions
export const {
  setAddressData,
  setAddressLoading,
  setAddressError,
  clearAddress,
} = addressSlice.actions;

// Error handler utility
const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Fetch user's addresses
export const fetchUserAddresses = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setAddressLoading());
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/getUserAddresses/${userId}`
    );
    if (response.data?.success) {
      dispatch(setAddressData(response.data.data));
      return true;
    } else {
      throw new Error(response.data?.message || "Failed to fetch addresses");
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    dispatch(setAddressError(errorMessage));
    return false;
  }
};

// Add a new address
export const addNewAddress = (userId: string, addressData: Address['addresses'][0]) => async (dispatch: AppDispatch) => {
  dispatch(setAddressLoading());
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/addAddress/${userId}`,
      addressData
    );
    if (response.data?.success) {
      dispatch(setAddressData(response.data.data));
      return true;
    } else {
      throw new Error(response.data?.message || "Failed to add address");
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    dispatch(setAddressError(errorMessage));
    return false;
  }
};

// Update an address
export const updateAddress = (
  userId: string,
  addressIndex: number,
  updatedData: Partial<Address['addresses'][0]>
) => async (dispatch: AppDispatch) => {
  dispatch(setAddressLoading());
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/updateAddress/${userId}/${addressIndex}`,
      updatedData
    );
    if (response.data?.success) {
      dispatch(setAddressData(response.data.data));
      return true;
    } else {
      throw new Error(response.data?.message || "Failed to update address");
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    dispatch(setAddressError(errorMessage));
    return false;
  }
};

// Delete an address
export const deleteAddress = (userId: string, addressIndex: number) => async (dispatch: AppDispatch) => {
  dispatch(setAddressLoading());
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/deleteAddress/${userId}/${addressIndex}`
    );
    if (response.data?.success) {
      dispatch(setAddressData(response.data.data));
      return true;
    } else {
      throw new Error(response.data?.message || "Failed to delete address");
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    dispatch(setAddressError(errorMessage));
    return false;
  }
};

// Set default address
export const setDefaultAddress = (userId: string, addressIndex: number) => async (dispatch: AppDispatch) => {
  dispatch(setAddressLoading());
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/addresses/setDefaultAddress/${userId}/${addressIndex}`
    );
    if (response.data?.success) {
      dispatch(setAddressData(response.data.data));
      return true;
    } else {
      throw new Error(response.data?.message || "Failed to set default address");
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    dispatch(setAddressError(errorMessage));
    return false;
  }
};

// Selectors
export const selectAddressData = (state: { address: AddressState }) => state.address.data;
export const selectAddressLoading = (state: { address: AddressState }) => state.address.isLoading;
export const selectAddressError = (state: { address: AddressState }) => state.address.error;
export const selectDefaultAddress = (state: { address: AddressState }) => 
  state.address.data?.addresses.find(addr => addr.isDefault);

// Export the reducer
export default addressSlice.reducer;