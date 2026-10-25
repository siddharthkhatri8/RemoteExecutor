import Navbar from "./components/Navbar";
import MainBody from "./components/MainBody";
import { useAuth } from "./contexts/authContext.jsx";

function App() {
    // remove this is something related to Auth breaks
    const { token, user, setToken, setUser } = useAuth();
    if (!token && localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
    }
    if (!user && localStorage.getItem("user")) {
        setUser(localStorage.getItem("user"));
    }
    return (
        <div className="flex flex-col h-screen w-full ">
            <Navbar />
            <MainBody />
        </div>
    );
}

export default App;