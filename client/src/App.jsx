
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";


function App() {
  return (
    <>
     <BrowserRouter>
     <Header/>
     <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/register" element={<Signup/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
     </Routes>
     </BrowserRouter>
    </>
  );
}

export default App;
