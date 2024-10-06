// store.js
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk'; // Explicit import of redux-thunk
import adminQuoteSlices from './slices/adminQuoteSlices';

const store = configureStore({
  reducer: {
    admin: adminQuoteSlices,
    // auth: authReducer,          // Another reducer for authentication
    // user: userReducer,          // Another reducer for user data
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
