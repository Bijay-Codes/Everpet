import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WelcomeScreen } from "./components/welcome";
import AuthContextProvider from "./context/auth-provider";
import Register from "./pages/register";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider >
        <section className="px-12 bg-slate-900 w-full h-screen">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/register" element={<Register />} />

          </Routes>
        </section>
      </AuthContextProvider>
    </BrowserRouter>
  )
};

export default App;
