import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import Meetups from "./pages/Meetups";
import AdminPanel from "./pages/AdminPanel";
import Badges from "./pages/Badges";
import Reports from "./pages/Reports";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import MyQuestions from "./pages/MyQuestions";
import MyAnswers from "./pages/MyAnswers";
import EditProfile from "./pages/EditProfile";
import About from "./pages/About";
import ContactSupport from "./pages/ContactSupport";
import TermsAndConditions from "./pages/TermsAndConditions";
import SettingsPage from "./pages/SettingsPage";
import Bookmarks from "./pages/Bookmarks";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const RoutesList = () => {
  return (
    <Routes>
      {/* Public Routes (No authentication needed) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/my-questions" element={<MyQuestions />} />
      <Route path="/my-answers" element={<MyAnswers />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/about" element={<About />} />
      <Route path="/support" element={<ContactSupport />} />
      <Route path="/terms" element={<TermsAndConditions />} />

      {/* Protected Routes (Requires authentication) */}
      <Route path="/badges" element={<ProtectedRoute component={Badges} />} />
      <Route
        path="/settings"
        element={<ProtectedRoute component={SettingsPage} />}
      />
      <Route path="/home" element={<ProtectedRoute component={Home} />} />
      <Route
        path="/dashboard"
        element={<ProtectedRoute component={Dashboard} />}
      />
      <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
      <Route path="/ask" element={<ProtectedRoute component={AskQuestion} />} />
      <Route
        path="/question/:id"
        element={<ProtectedRoute component={QuestionDetail} />}
      />
      <Route path="/meetups" element={<ProtectedRoute component={Meetups} />} />
      <Route
        path="/admin"
        element={<ProtectedRoute component={AdminPanel} />}
      />
      <Route path="/badges" element={<ProtectedRoute component={Badges} />} />
      <Route
        path="/bookmarks"
        element={<ProtectedRoute component={Bookmarks} />}
      />
      <Route path="/reports" element={<ProtectedRoute component={Reports} />} />

      {/* Catch-all Route */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default RoutesList;
