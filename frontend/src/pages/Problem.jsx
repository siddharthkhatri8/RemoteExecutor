import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { BASE_URL } from "../constants.js";

// complete the use Effect API code

const Problem = () => {
    const redirect = useNavigate();
    const { id } = useParams();
    const [problemData, setProblemData] = useState(null);
    const URI = `${BASE_URL}/problem/${id}`;

    useEffect(() => {
        Axios({ url: URI })
            .then((data) => {
                // here we assuming that whatever the condition is if "data" exists then "data.data" will also exist.
                setProblemData(data.data);
            })
            .catch((err) => {
                console.log("ProblemError: ", err);
                redirect("/pagenotfound");
            });
    }, [id, URI]);

    return (
        <>
            {problemData ? (
                <div className="w-full flex flex-col justify-evenly my-5">
                    <div className="text-2xl font-semibold mb-4">
                        {id}. {problemData.title}
                    </div>
                    <div className="mb-8">
                        {problemData.description.paragraphs.length > 0 &&
                            problemData.description.paragraphs.map(
                                (item, i) => {
                                    return (
                                        <p key={i} className="mb-4">
                                            {item}
                                        </p>
                                    );
                                }
                            )}
                        {problemData.description.images.length > 0 &&
                            problemData.description.images.map((item, i) => {
                                return (
                                    <img
                                        className="mb-2"
                                        src={item}
                                        key={i}
                                        alt="Problem helping Image"
                                    />
                                );
                            })}
                    </div>
                    <div className="mb-8">
                        {problemData.description.examples.length > 0 &&
                            problemData.description.examples.map((item, i) => {
                                return (
                                    <div key={i} className="mb-4">
                                        <h3 className="mb-4">
                                            <b>Example {i + 1}:</b>
                                        </h3>
                                        {item.images?.length > 0 &&
                                            item.images.map((images, j) => {
                                                return (
                                                    <img
                                                        className="mb-4"
                                                        key={j}
                                                        src={images}
                                                        alt="Example helping Image"
                                                    />
                                                );
                                            })}
                                        <div className="px-5 border-l-2 border-gray-200">
                                            <h3>
                                                <b className="mr-2">Input: </b>
                                                <span className=" font-light text-gray-600 ">
                                                    {item.input}
                                                </span>
                                            </h3>
                                            <h3>
                                                <b className="mr-2">Output: </b>
                                                <span className=" font-light text-gray-600 ">
                                                    {item.output}
                                                </span>
                                            </h3>
                                            {item.explanation ? (
                                                <h3>
                                                    <b className="mr-2">
                                                        Explanation:{" "}
                                                    </b>
                                                    <span className=" font-light text-gray-600 ">
                                                        {item.explanation}
                                                    </span>
                                                </h3>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {problemData.description.constraints.length > 0 && (
                        <div className="mb-4">
                            <h3 className="mb-4">
                                <b>Constraints:</b>
                            </h3>
                            <ul className="list-disc list-inside">
                                {problemData.description.constraints.map(
                                    (item, i) => {
                                        return (
                                            <li key={i} className="mb-2">
                                                {item}
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    )}
                    <Link
                        to="/terminal"
                        className="my-5 w-fit mx-auto text-white bg-gradient-to-bl from-slate-500 to-slate-800 py-3 px-12 rounded-md"
                    >
                        Solve
                    </Link>
                </div>
            ) : (
                <div className="contentloader">
                    <img src="/Design.png" alt="Remote Executer Logo" />
                </div>
            )}
        </>
    );
};

export default Problem;