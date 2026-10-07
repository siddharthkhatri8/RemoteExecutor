import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await api.get("/api/problems");
        setProblems(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <div className="p-8">Loading problems...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">Problems</h1>

        <p className="mb-8 text-gray-600">
          Practice coding problems and improve your programming skills.
        </p>

        {problems.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">
            No problems available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {problems.map((problem) => (
              <Link
                key={problem._id}
                to={`/problems/${problem._id}`}
                className="block rounded-lg bg-white p-6 shadow transition hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {problem.title}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : problem.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>

                <p className="mt-2 text-gray-600">
                  {problem.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Problems;