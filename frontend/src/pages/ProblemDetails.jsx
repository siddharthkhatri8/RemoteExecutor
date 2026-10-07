import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const ProblemDetails = () => {
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await api.get(`/api/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        console.error(error);
        setError("Failed to load problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return <div className="p-8">Loading problem...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!problem) {
    return <div className="p-8">Problem not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/problems"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          ← Back to Problems
        </Link>

        <div className="rounded-lg bg-white p-8 shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{problem.title}</h1>

            <span className="rounded-full bg-gray-100 px-4 py-2">
              {problem.difficulty}
            </span>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {problem.description}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Input Format</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {problem.inputFormat}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Output Format</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {problem.outputFormat}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Constraints</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-700">
              {problem.constraints}
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Sample Input</h2>

            <pre className="mt-2 rounded bg-gray-900 p-4 text-white">
              {problem.sampleInput}
            </pre>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Sample Output</h2>

            <pre className="mt-2 rounded bg-gray-900 p-4 text-white">
              {problem.sampleOutput}
            </pre>
          </section>

          <div className="mt-10">
            <Link
              to="/editor"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Open Editor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;