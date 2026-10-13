import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../constants.js";

const CoursePage = () => {
    const navigate = useNavigate();
    const [coursesData, setCoursesData] = useState(null);
    const { id } = useParams();
    const URI = `${BASE_URL}/course/${id}`;
    useEffect(() => {
        Axios({ url: URI })
            .then((data) => {
                setCoursesData(data.data);
            })
            .catch((error) => {
                console.log("Error occured in loading course data: ", error);
                navigate("/pagenotfound");
            });
    }, [URI]);

    return (
        <div>
            <div
                className="w-full bg-cover bg-center h-60 rounded-lg text-white p-4 flex items-center justify-center shadow-lg"
                style={{ backgroundImage: `url('/Courses/1.png')` }}
            >
                <div className="font-medium drop-shadow-lg  text-4xl h-full flex items-center max-w-3xl ">
                    {coursesData && (coursesData.courseName ?? "")}
                </div>
            </div>
            {coursesData ? (
                <div className="w-full flex p-8 flex-auto flex-shrink-0 bottom-20 px-16 justify-between ">
                    <div className="w-1/3 mr-12 flex-initial flex-shrink-0  ">
                        <img
                            src={coursesData.thumbnail}
                            alt="course thumbnail"
                            className="shadow-lg rounded-md"
                        />
                        <a
                            target="_blank"
                            rel="noreferrer"
                            className="mt-5 relative  flex items-center justify-center h-20 w-20 rounded-full p-2 bottom-16 left-6 text-white italic text-lg animate-pulse"
                            href={coursesData.link}
                            style={{
                                backgroundImage:
                                    "linear-gradient(45deg, #01021a,#edebf2 )",

                                backgroundSize: "600% 600%",
                                animation: "Gradient 2s ease infinite",
                            }}
                        >
                            Watch
                        </a>

                        <style>{`
                        @keyframes Gradient {
                            0% {
                                scale: 1;
                                background-position: 0% 50%;
                            }
                            50% {
                                scale: 1.2;
                                background-position: 100% 50%;
                            }
                            100% {
                                scale: 1;
                                background-position: 0% 50%;
                            }
                        }
                    `}</style>
                    </div>
                    <div className="flex  flex-col flex-auto ">
                        <h2 className="text-4xl py-2 ">Introduction</h2>
                        {coursesData.courseDescription &&
                            coursesData.courseDescription.map((item, key) => {
                                return (
                                    <p className="py-2" key={key}>
                                        {item}
                                    </p>
                                );
                            })}
                    </div>
                </div>
            ) : (
                <div className="contentloader">
                    <img src="/Design.png" alt="Remote Executer Logo" />
                </div>
            )}
        </div>
    );
};
export default CoursePage;