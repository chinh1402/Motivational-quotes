import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRouteAuthenticated from "../components/ProtectedRoutesAuthenticated"
import ProtectedRouteAdmin from "../components/ProtectedRoutesAdmin"; // Wrapper for authenticated routes

// Unauthenticated Pages
import HomePage from "../pages/Unauthenticated/home/index.jsx";
import LoginPage from "../pages/Unauthenticated/login/index.jsx";
// import SignupPage from "../pages/auth/SignupPage";
// import RandomQuotePage from "../pages/quotes/RandomQuotePage";

// // Authenticated Pages
// import QuoteGalleryPage from "../pages/quotes/QuoteGalleryPage";
// import DailyEmailSignupPage from "../pages/auth/DailyEmailSignupPage";
// import AccountPage from "../pages/user/AccountPage";
// import FavoritesPage from "../pages/user/FavoritesPage";
// import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
// import DeleteAccountPage from "../pages/user/DeleteAccountPage";

// // Admin Pages
import AdminDashboardPage from "../pages/Admin/dashboard/index.jsx";
import AdminQuotesPage from "../pages/Admin/quotes/index.jsx";
import AdminQuoteSequencesPage from "../pages/Admin/quoteSequences/index.jsx";
import AdminUsersPage from "../pages/Admin/users/index.jsx";
import AdminSurveyTicketsPage from "../pages/Admin/surveytickets/index.jsx";
import AdminTagsPage from "../pages/Admin/tags/index.jsx";

// // Not Found Page
// import NotFoundPage from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <AdminDashboardPage />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/quotes"
          element={
            <ProtectedRouteAdmin>
              <AdminQuotesPage/>
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/quote-sequences"
          element={
            <ProtectedRouteAdmin>
              <AdminQuoteSequencesPage />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRouteAdmin>
              <AdminUsersPage />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/tags"
          element={
            <ProtectedRouteAdmin>
              <AdminTagsPage />
            </ProtectedRouteAdmin>
          }
        />
        <Route
          path="/admin/survey-tickets"
          element={
            <ProtectedRouteAdmin>
              <AdminSurveyTicketsPage />
            </ProtectedRouteAdmin>
          }
        />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
