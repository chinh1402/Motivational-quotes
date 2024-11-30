import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { unauthenticatedAPI } from "../../services/apiServices";

// Async actions using Redux Thunk

// Signup
export const signup = createAsyncThunk(
  "unauthenticated/signup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await unauthenticatedAPI.signup(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

// Signup Confirmation
export const signupConfirmed = createAsyncThunk(
  "unauthenticated/signupConfirmed",
  async (email, { rejectWithValue }) => {
    try {
      const response = await unauthenticatedAPI.signupConfirmed(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup confirmation failed");
    }
  }
);

// Login
export const login = createAsyncThunk(
  "unauthenticated/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await unauthenticatedAPI.login(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "unauthenticated/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await unauthenticatedAPI.logout();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Google Login
export const googleLogin = createAsyncThunk(
  "unauthenticated/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await unauthenticatedAPI.googleLogin();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Google login failed");
    }
  }
);

// Google Callback
export const googleCallback = createAsyncThunk(
  "unauthenticated/googleCallback",
  async (_, { rejectWithValue }) => {
    try {
      const response = await unauthenticatedAPI.googleCallback();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Google callback failed");
    }
  }
);

// Get Quote List
export const getQuoteList = createAsyncThunk(
  "unauthenticated/getQuoteList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await unauthenticatedAPI.getQuoteList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Fetching quotes failed");
    }
  }
);

// Initial state
const initialState = {
  user: null,
  quotes: [],
  loading: false,
  error: null,
};

// Slice
const unauthenticatedSlice = createSlice({
  name: "unauthenticated",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup Confirmed
      .addCase(signupConfirmed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupConfirmed.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupConfirmed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Assuming the user data is in `payload.user`
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Google Callback
      .addCase(googleCallback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleCallback.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Assuming callback also provides user data
      })
      .addCase(googleCallback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Quote List
      .addCase(getQuoteList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuoteList.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload.quotes; // Assuming quotes are in `payload.quotes`
      })
      .addCase(getQuoteList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetError } = unauthenticatedSlice.actions;
export default unauthenticatedSlice.reducer;
