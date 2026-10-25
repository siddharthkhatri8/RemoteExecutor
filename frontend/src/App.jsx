import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/authContext.jsx";
import Home from "./Pages/Home";
import Login from "./Pages/LogIn";
import Signup from "./Pages/SignUp";
import Problems from "./Pages/Problems";
import ProblemDetails from "./Pages/ProblemDetails";
import EditorPage from "./Pages/Editor";
import Submissions from "./Pages/Submissions";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:problemId" element={<EditorPage />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />
          <Route
            path="/submissions"
            element={<Submissions />}
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;