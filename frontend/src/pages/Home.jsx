import { useLocation } from "react-router-dom";
import Courses from "../components/Courses.jsx";
import { useEffect, useState } from "react";
import Axios from "axios";
import { BASE_URL } from "../constants.js";

const Home = () => {
    const [courseData, setCourseData] = useState(null);
    const { hash } = useLocation();
    const URI = `${BASE_URL}/course/home`;

    useEffect(() => {
        if (hash === "#explore") {
            document.getElementById("explore").scrollIntoView();
        }
    }, [hash]);

    useEffect(() => {
        Axios({ url: URI })
            .then((data) => {
                setCourseData(data.data);
            })
            .catch((error) => {
                console.log("Error occured in loading courses data: ", error);
            });
    }, []);

    return (
        <>
            <div className="w-full h-min flex items-center bg-gradient-to-br justify-center rounded-3xl drop-shadow-2xl from-slate-600 to-slate-950 p-14 text-gray-200 overflow-hidden">
                <img
                    src="./Design.png"
                    alt="Remote executer Logo"
                    className="w-48 p-4 logoBounce"
                />
                <div className="flex flex-col flex-shrink-0 items-center text-center m-4 px-8 w-8/12">
                    <h2 className="text-3xl text-gray-50 py-2">
                        Welcome to our Online Coding Environment
                    </h2>
                    <p className="py-2 text-gray-400">
                        Tired of the hassle of installing compilers,
                        interpreters, and setting up a coding environment? We
                        have got you covered! With our platform, you can focus
                        on coding while we handle all the setup and
                        configuration for you. Stay up-to-date with the latest
                        languages and technologies without the headache of
                        manual setup.
                    </p>
                    <p className="py-2 text-gray-400">
                        <span className="text-white">Below </span>
                        are the free resources that helped me learn programming.
                    </p>
                </div>
            </div>
            {/* The component below could be improved using sliding gallery */}
            <div
                id="explore"
                className="flex my-2 py-2 items-center justify-between flex-wrap"
            >
                {courseData &&
                courseData.courseList &&
                courseData.courseList.length > 0 ? (
                    courseData.courseList.map((item, i) => {
                        return <Courses key={i} course={item} />;
                    })
                ) : (
                    <div className="contentloader">
                        <img src="/Design.png" alt="Remote Executer Logo" />
                    </div>
                )}
            </div>
        </>
    );
};
export default Home;