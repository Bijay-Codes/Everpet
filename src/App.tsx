import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WelcomeScreen } from "./pages/welcome";
import AuthContextProvider from "./context/auth-provider";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/protected/dashboard";
import ShowOffline from "./components/show-offline";
import HandleRedirect from "./components/handle-redirect";
import ProtectedNav from "./components/handle-navbar";
import PetStore from "./pages/protected/pet-store";
import Pets from "./pages/protected/pets";

function App() {
  return (
    <AuthContextProvider >
      <BrowserRouter>
        <section className="bg-dark-bg w-full h-screen relative">
          <ShowOffline />
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes (redirect to / when not logged in) */}
            <Route element={<HandleRedirect />} >
              <Route element={<ProtectedNav />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pet-store" element={<PetStore />} />
                <Route path="/pets" element={<Pets />} />
              </Route>
            </Route>
          </Routes>
        </section>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
