import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import ProtectedRoute from "./pages/ProtectedRoute";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/eventDetails";
import UpdateEvent from "./pages/UpdateEvent";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<Dashboard />} />
          <Route path="/event/:eventId" element={<EventDetails />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/create" element={<CreateEvent />} />
            <Route path="/:eventId/update" element={<UpdateEvent />} />
            <Route path="/profile" element={<Profile />} />
            
          </Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;
