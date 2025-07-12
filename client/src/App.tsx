import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import HomePage from "./pages/HomePage";
import Temp from "./components/temp";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import AskQuestionPage from "./pages/AskQuestionPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/question/:id" element={<Temp />} />
          <Route path="/ask" element={<AskQuestionPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
