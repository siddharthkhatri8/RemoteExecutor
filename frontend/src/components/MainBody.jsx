import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import Blog from "../Pages/Blog";
import Practise from "../Pages/Practise";
import LogIn from "../Pages/LogIn";
import SignUp from "../Pages/SignUp";
import Terminal from "../Pages/Terminal";
import PageNotFound from "../Pages/PageNotFound";
import CoursePage from "../Pages/CoursePage";
import Problem from "../Pages/Problem";

const MainBody = () => {
    return (
        <main className="px-24 py-3 w-full flex flex-col flex-auto flex-shrink-0 h-fit overflow-x-hidden">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="blogs" element={<Blog />} />
                <Route path="practise" element={<Practise />}></Route>
                <Route path="problem/:id" element={<Problem />}></Route>
                <Route path="login" element={<LogIn />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="pagenotfound" element={<PageNotFound />} />
                <Route path="terminal" element={<Terminal />} />
                <Route path="course/:id" element={<CoursePage />} />
                <Route
                    path="*"
                    element={<Navigate to={"pagenotfound"} replace />}
                />
            </Routes>
        </main>
    );
};
export default MainBody;