import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAuth } from "../contexts/authContext.jsx";
import { BASE_URL } from "../constants.js";

const SignUp = () => {
    const { setToken, setUser } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [email, setEmail] = useState("");
    const URL = `${BASE_URL}/signup`;
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const userObject = {};
        for (let i = 0; i < e.target.elements.length; i++) {
            const item = e.target.elements[i];
            if (item.value) {
                userObject[item.name] = item.value;
            }
        }
        if (password && email && username) {
            Axios(URL, {
                method: "POST",
                data: {
                    userObject: userObject,
                },
            })
                .then((data) => {
                    // Put this token into AuthContext
                    setToken(data.data.token);
                    setUser(JSON.stringify(data.data.user));
                    setRegistrationStatus({
                        message: data.data.message,
                        borderColor: "border-green-600",
                        bgColor: "bg-green-100",
                        error: false,
                    });
                    navigate("/");
                })
                .catch((error) => {
                    setRegistrationStatus({
                        message: error.response.data.error,
                        borderColor: "border-red-600",
                        bgColor: "bg-red-100",
                        error: true,
                    });
                });
        }
        else {
            setRegistrationStatus({
                message: "Enter Credentials",
                borderColor: "border-red-600",
                bgColor: "bg-red-100",
                error: true,
            });
        }
    };

    return (
        <div className="h-full flex flex-col justify-evenly items-center w-2/5 mx-auto  shadow-md px-10 py-8 bg-gray-50 rounded-md">
            <div className="flex flex-col items-center">
                <img src="/Design.png" className="w-20" alt="Logo" />
                <h3 className="mt-2 text-lg font-medium san">
                    Remote Executor
                </h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col w-full my-2">
                <span>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        placeholder="Username"
                        className="w-full my-2 py-3 px-4 rounded-md font-extralight border-x border-y"
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </span>
                <span>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="E-mail address"
                        className="w-full my-2 py-3 px-4 rounded-md font-extralight border-x border-y"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                </span>
                <span>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        className="w-full my-2 py-3 px-4 rounded-md font-extralight border-x border-y"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </span>
                <span>
                    <button className="w-full my-2 text-white bg-gradient-to-bl from-slate-500 to-slate-800 py-3 px-4 rounded-md">
                        Sign Up
                    </button>
                </span>
            </form>
            <div>
                <p className="text-sm text-gray-400 font-light">
                    Have an account?
                    <Link to="/login" className="text-blue-900 text-base ml-1">
                        Sign In
                    </Link>
                </p>
            </div>
            {registrationStatus ? (
                <div
                    className={`rounded-md border-2  w-full px-8 py-4 mt-5 ${registrationStatus.borderColor} ${registrationStatus.bgColor}`}
                >
                    {registrationStatus.message}
                </div>
            ) : null}
        </div>
    );
};
export default SignUp;