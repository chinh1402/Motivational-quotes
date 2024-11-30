// adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAPI } from "../../services/apiServices";

// Async actions using redux-thunk
export const getQuotes = createAsyncThunk(
  "admin/getQuotes",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getQuotes(params);
      return response.data; // Assuming API returns data in response.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addQuote = createAsyncThunk(
  "admin/addQuote",
  async (quoteData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.addQuote(quoteData);
      return response.data; // Assuming the new quote is returned
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateQuote = createAsyncThunk(
  "admin/updateQuote",
  async (quoteData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateQuote(quoteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteQuote = createAsyncThunk(
  "admin/deleteQuote",
  async (quoteNumberId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteQuote(quoteNumberId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// quoteSequence

export const getQuoteSequences = createAsyncThunk(
  "admin/getQuoteSequences",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getQuoteSequences(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addQuoteSequence = createAsyncThunk(
  "admin/addQuoteSequence",
  async (sequenceData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.createQuoteSequence(sequenceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateQuoteSequence = createAsyncThunk(
  "admin/updateQuoteSequence",
  async (sequenceData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateQuoteSequence(sequenceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteQuoteSequence = createAsyncThunk(
  "admin/deleteQuoteSequence",
  async (sequenceId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteQuoteSequence(sequenceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Users
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserfavorites = createAsyncThunk(
  "admin/userfavorites",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.userfavorites(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserFavorite = createAsyncThunk(
  "admin/deletefavorite",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deletefavorite(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.addUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Tags
export const getTags = createAsyncThunk(
  "admin/getTags",
  async (params, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getTags(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTag = createAsyncThunk(
  "admin/addTag",
  async (tagData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.addTag(tagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTag = createAsyncThunk(
  "admin/updateTag",
  async (tagData, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateTag(tagData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTag = createAsyncThunk(
  "admin/deleteTag",
  async (tagId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.deleteTag(tagId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state for the slice
const initialState = {
  quotes: [],
  userFavorites: [],
  quoteSequences: [],
  users: [],
  tags: [],
  loading: false,
  error: false,
  success: false, // Add success state
  toastMessage: "",
};

// Admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false; // Reset success state
    },
    resetError: (state) => {
      state.error = false; // Reset success state
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Quote ---
      .addCase(getQuotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes = action.payload.quotes; // Assuming payload contains the list of quotes
        state.pagination = action.payload.pagination;
      })
      .addCase(getQuotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch quotes";
      })

      .addCase(addQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuote.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.success = true;
        state.toastMessage = "Quote added successfully";
        state.quotes.push(action.payload); // Assuming new quote is added to the list
      })
      .addCase(addQuote.rejected, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.error = action.payload || "Failed to add quote";
      })

      .addCase(updateQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        state.loading = false;
        const updatedQuote = action.payload;
        state.success = true;
        state.toastMessage = "Quote updated successfully";
        const index = state.quotes.findIndex(
          (q) => q.quoteNumberId === updatedQuote.quoteNumberId
        );
        if (index !== -1) {
          state.quotes[index] = updatedQuote;
        }
      })
      .addCase(updateQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update quote";
      })

      .addCase(deleteQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "Quote deleted successfully";
        const quoteNumberId = action.meta.arg;
        state.quotes = state.quotes.filter(
          (q) => q.quoteNumberId !== quoteNumberId
        );
      })
      .addCase(deleteQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete quote";
      })

      // --- Quote Sequences ---
      .addCase(getQuoteSequences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuoteSequences.fulfilled, (state, action) => {
        state.loading = false;
        state.quoteSequences = action.payload.quoteSequences; // Assuming payload contains quote sequences
        console.log(action.payload);
        state.pagination = action.payload.pagination;
      })
      .addCase(getQuoteSequences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch quote sequences";
      })

      .addCase(addQuoteSequence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuoteSequence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "Quote sequence added successfully";
        state.quoteSequences.push(action.payload.quoteSequence);
      })
      .addCase(addQuoteSequence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add quote sequence";
      })

      .addCase(updateQuoteSequence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuoteSequence.fulfilled, (state, action) => {
        state.loading = false;
        const updatedSequence = action.payload.updatedQuoteSequence;
        state.success = true;
        state.toastMessage = "Quote sequence updated successfully";
        const index = state.quoteSequences.findIndex(
          (s) => s._id === updatedSequence._id
        );
        if (index !== -1) {
          state.quoteSequences[index] = updatedSequence;
        }
      })
      .addCase(updateQuoteSequence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update quote sequence";
      })

      .addCase(deleteQuoteSequence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuoteSequence.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "Quote sequence deleted successfully";
        const sequenceId = action.meta.arg;
        state.quoteSequences = state.quoteSequences.filter(
          (s) => s._id !== sequenceId
        );
      })
      .addCase(deleteQuoteSequence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete quote sequence";
      })

      // --- Users ---
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users; // Assuming payload contains users
        state.pagination = action.payload.pagination;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users";
      })

      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "User added successfully";
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add user";
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.user;
        state.success = true;
        state.toastMessage = "User updated successfully";
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "User deleted successfully";
        const userId = action.meta.arg;
        state.users = state.users.filter((u) => u._id !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user";
      })

      // --- Tags ---
      .addCase(getTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags; // Assuming payload contains tags
        state.pagination = action.payload.pagination;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tags";
      })

      .addCase(addTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTag.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "Tag added successfully";
        state.tags.push(action.payload);
      })
      .addCase(addTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add tag";
      })

      .addCase(updateTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTag = action.payload;
        state.success = true;
        state.toastMessage = "Tag updated successfully";
        const index = state.tags.findIndex((t) => t._id === updatedTag._id);
        if (index !== -1) {
          state.tags[index] = updatedTag;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update tag";
      })

      .addCase(getUserfavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserfavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.userFavorites = action.payload.userFavorites; // Assuming payload contains tags
        state.paginationForUserFavorite = action.payload.pagination;
        console.log(state.paginationForUserFavorite)
      })
      .addCase(getUserfavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to get user favorites";
      })

      .addCase(deleteUserFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "Quote deleted successfully";
        const deletedQuote = action.meta.arg.quoteNumberId;
        state.userFavorites = state.userFavorites.filter((q) => q.quoteNumberId !== deletedQuote);
      })
      .addCase(deleteUserFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete user favorite";
      })

      .addCase(deleteTag.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.toastMessage = "Tag deleted successfully";
        const tagId = action.meta.arg;
        state.tags = state.tags.filter((t) => t._id !== tagId);
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete tag";
      });
  },
});

export const { resetError, resetSuccess, setNightMode } = adminSlice.actions;

export default adminSlice.reducer;
