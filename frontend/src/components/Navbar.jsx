import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useAuth } from "../contexts/authContext.jsx";

const Navbar = () => {
    const { username, token, logOut } = useAuth();
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <div className="border-b border-b-slate-200 h-fit w-full px-24 shadow-sm flex justify-between items-center flex-initial flex-shrink-0 ">
            <div className=" h-fit flex items-center flex-initial flex-shrink-0 ">
                <Link to="/" className="mr-8">
                    <img src="/Design.png" className="w-7 rounded-sm" />
                </Link>
                <ul className="h-fit flex items-center">
                    <NavBarTitle to="/#explore">Explore</NavBarTitle>
                    <NavBarTitle to="/practise?size=10&pageSet=0">
                        Practise
                    </NavBarTitle>

                </ul>
            </div>
            <div className=" flex items-center text-sm text-gray-500 h-full">
                <Link
                    to="/terminal"
                    className="relative group bg-gradient-to-r from-purple-300 to-purple-200 hover:from-purple-100 hover:to-indigo-100 text-slate-700 hover:text-purple-700 font-medium py-2 px-6 rounded-lg mx-4 transition-all duration-500 ease-in-out border animate-pulse hover:shadow-md"
                >
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-2 transition-colors duration-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">
                            Code
                        </span>
                    </span>
                </Link>
                {(username || user?.username) && (
                    <p className="py-2 px-4 bg-green-100 mr-5 rounded-md">
                        Logged in as {username || user?.username}
                    </p>
                )}
                {token ? (
                    <span>
                        <button
                            className="w-full my-2 text-white bg-gradient-to-bl from-slate-500 to-slate-800 py-2 px-4 rounded-md"
                            onClick={logOut}
                        >
                            Log Out
                        </button>
                    </span>
                ) : (
                    <span className="flex items-center text-sm text-gray-500 h-full">

                        <Link
                            to="/signup"
                            className="hover:text-black mx-1 px-1 font-light"
                        >
                            Register
                        </Link>
                        <p className=" mx-1 px-1 font-light">or </p>
                        <Link
                            to="/login"
                            className="hover:text-black mx-1 px-1 font-light"
                        >
                            Sign in
                        </Link>
                    </span>
                )}
            </div>
        </div>
    );
};

const NavBarTitle = ({ to, children }) => {
    const path = useResolvedPath(to);
    const styles = useMatch({ path: path.pathname })
        ? "h-fit py-3 px-1 mx-2 border-b-2 border-black text-black text-base font-light font-semibold"
        : "h-fit py-3 px-1 mx-2 border-b-2 border-white text-gray-500 hover:text-black text-base font-light";
    return (
        <li className={styles}>
            <Link to={to}>{children}</Link>
        </li>
    );
};
export default Navbar;