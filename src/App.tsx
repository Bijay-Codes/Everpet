import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WelcomeScreen } from "./pages/welcome";
import AuthContextProvider from "./context/auth-provider";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider >
        <section className="px-12 bg-slate-900 w-full h-screen">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </section>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
