import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import { AuthProvider } from "./context/AuthProvider";
import Navbar from "./component/common/Navbar";
import Footer from "./component/common/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Workspaces from "./pages/Workspaces";
import WorkspaceDetails from "./pages/WorkspaceDetails";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import WorkspaceForm from "./pages/owner/WorkspaceForm";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/workspaces/:id" element={<WorkspaceDetails />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/workspaces/new" element={<WorkspaceForm />} />
            <Route path="/owner/workspaces/:id/edit" element={<WorkspaceForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;