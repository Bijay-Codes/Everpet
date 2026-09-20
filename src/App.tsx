import { WelcomeScreen } from "./components/welcome"
import AuthContextProvider from "./context/auth-provider"
function App() {
  return (
    <AuthContextProvider >
      <main>
        <WelcomeScreen />
      </main>
    </AuthContextProvider>
  )
}

export default App
