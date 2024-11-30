// store.js
import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk"; // Explicit import of redux-thunk
import adminQuoteSlices from "./slices/adminQuoteSlices";
import pageSetting from "./slices/pageSettingSlices";
import unregisteredReducer from "./slices/unregisteredSlices";
import { reducer as burgerMenu } from "redux-burger-menu";

const store = configureStore({
  reducer: {
    admin: adminQuoteSlices,
    // authenticated: authenticatedReducer,          
    unregistered: unregisteredReducer,          
    pageSetting: pageSetting,
    burgerMenu,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
