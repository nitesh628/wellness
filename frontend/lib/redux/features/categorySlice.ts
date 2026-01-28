import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import axios from "axios";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface CategoryState {
  data: Category[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: Category | null;
  filters: {
    status: string;
    name?: string;
  };
}

const initialState: CategoryState = {
  data: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  filters: {
    status: "",
    name: "",
  },
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("accessToken");

      if (token) {
        token = token.replace(/^"|"$/g, "");
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategoryData: (state, action: PayloadAction<Category[]>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCategoryLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setCategoryError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<CategoryState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
});

export const {
  setCategoryData,
  setCategoryLoading,
  setCategoryError,
  setSelectedCategory,
  setFilters,
  clearSelectedCategory,
} = categorySlice.actions;

const mapApiCategoryToCategory = (apiCategory: ApiCategory): Category => ({
  _id: apiCategory._id,
  name: apiCategory.name,
  slug: apiCategory.slug,
  description: apiCategory.description,
  imageUrl: apiCategory.image,
  status: apiCategory.status,
  metaTitle: apiCategory.metaTitle || apiCategory.name,
  metaDescription: apiCategory.metaDescription || apiCategory.description,
  createdAt: apiCategory.createdAt,
  updatedAt: apiCategory.updatedAt,
});

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const fetchCategoriesData =
  () =>
  async (
    dispatch: AppDispatch,
    getState: () => { categories: CategoryState }
  ) => {
    dispatch(setCategoryLoading());
    try {
      const { filters } = getState().categories;
      const queryParams = new URLSearchParams();

      if (filters.status && filters.status !== "all") {
        queryParams.append("status", filters.status);
      }
      if (filters.name) {
        queryParams.append("name", filters.name);
      }

      const queryString = queryParams.toString();
      const url = queryString ? `/categories?${queryString}` : `/categories`;

      const response = await api.get(url);

      if (response.data?.success && Array.isArray(response.data.data)) {
        const mappedCategories = response.data.data.map((cat: ApiCategory) =>
          mapApiCategoryToCategory(cat)
        );
        dispatch(setCategoryData(mappedCategories));
      } else {
        throw new Error(response.data?.message || "Failed to fetch categories");
      }
      return true;
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setCategoryError(errorMessage));
      return false;
    }
  };

export const fetchActiveCategories = () => async (dispatch: AppDispatch) => {
  dispatch(setCategoryLoading());
  try {
    const response = await api.get(`/categories/getActiveCategories`);
    if (response.data?.success && Array.isArray(response.data.data)) {
      const mappedCategories = response.data.data.map((cat: ApiCategory) =>
        mapApiCategoryToCategory(cat)
      );
      dispatch(setCategoryData(mappedCategories));
    } else {
      throw new Error(response.data?.message || "Failed to fetch categories");
    }
    return true;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    dispatch(setCategoryError(errorMessage));
    return false;
  }
};

export const fetchCategoryById =
  (categoryId: string) => async (dispatch: AppDispatch) => {
    dispatch(setCategoryLoading());
    try {
      const response = await api.get(
        `/categories/getCategoryById/${categoryId}`
      );
      if (response.data?.success) {
        const category = response.data.data;
        const mappedCategory = mapApiCategoryToCategory(category);
        dispatch(setSelectedCategory(mappedCategory));
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to fetch category");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setCategoryError(errorMessage));
      return false;
    }
  };

export const fetchCategoryBySlug =
  (slug: string) => async (dispatch: AppDispatch) => {
    dispatch(setCategoryLoading());
    try {
      const response = await api.get(`/categories/getCategoryBySlug/${slug}`);
      if (response.data?.success) {
        const category = response.data.data;
        const mappedCategory = mapApiCategoryToCategory(category);
        dispatch(setSelectedCategory(mappedCategory));
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to fetch category");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setCategoryError(errorMessage));
      return false;
    }
  };

export const fetchLatestCategories = () => async (dispatch: AppDispatch) => {
  dispatch(setCategoryLoading());
  try {
    const response = await api.get(`/categories/getLatestCategories`);
    if (response.data?.success) {
      const mappedCategories = response.data.data.categories.map(
        (cat: ApiCategory) => mapApiCategoryToCategory(cat)
      );
      dispatch(setCategoryData(mappedCategories));
    } else {
      throw new Error(
        response.data?.message || "Failed to fetch latest categories"
      );
    }
    return true;
  } catch (error: unknown) {
    const errorMessage = handleApiError(error);
    dispatch(setCategoryError(errorMessage));
    return false;
  }
};

export const createCategory =
  (newCategory: FormData) => async (dispatch: AppDispatch) => {
    try {
      const response = await api.post(`/categories/newCategory`, newCategory, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.success) {
        dispatch(setCategoryLoading());
        return true;
      } else {
        const errorMessage =
          response.data?.message || "Failed to create category";
        dispatch(setCategoryError(errorMessage));
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setCategoryError(errorMessage));
      return false;
    }
  };

export const updateCategoryStatus =
  (categoryId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await api.put(
        `/categories/updateCategoryStatus/${categoryId}`
      );
      if (response.data?.success) {
        dispatch(setCategoryLoading());
      } else {
        throw new Error(
          response.data?.message || "Failed to update category status"
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      dispatch(setCategoryError(errorMessage));
    }
  };

export const updateCategory =
  (categoryId: string, updatedData: FormData) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await api.put(
        `/categories/updateCategory/${categoryId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data?.success) {
        dispatch(setCategoryLoading());
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to update category");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setCategoryError(errorMessage));
      return false;
    }
  };

export const deleteCategory =
  (categoryId: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await api.delete(
        `/categories/deleteCategory/${categoryId}`
      );
      if (response.data?.success) {
        dispatch(setCategoryLoading());
        return true;
      } else {
        throw new Error(response.data?.message || "Failed to delete category");
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error);
      dispatch(setCategoryError(errorMessage));
      return false;
    }
  };

export const selectCategoriesData = (state: { categories: CategoryState }) => state.categories.data;
export const selectCategoriesLoading = (state: { categories: CategoryState }) => state.categories.isLoading;
export const selectCategoriesError = (state: { categories: CategoryState }) => state.categories.error;
export const selectSelectedCategory = (state: { categories: CategoryState }) => state.categories.selectedCategory;
export const selectCategoriesFilters = (state: { categories: CategoryState }) => state.categories.filters;

export default categorySlice.reducer;