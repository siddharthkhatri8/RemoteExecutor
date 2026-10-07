import { useEffect, useState } from "react";
import api from "../services/api";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await api.get("/api/submissions/my");
        setSubmissions(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div className="p-8">Loading submissions...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">
          Submission History
        </h1>

        {submissions.length === 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">
            No submissions yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Problem</th>
                  <th className="p-4 text-left">Language</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Tests</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {submission.problem?.title}
                    </td>

                    <td className="p-4">
                      {submission.language}
                    </td>

                    <td
                      className={`p-4 font-semibold ${
                        submission.status === "Accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {submission.status}
                    </td>

                    <td className="p-4">
                      {submission.passedTests}/
                      {submission.totalTests}
                    </td>

                    <td className="p-4">
                      {new Date(
                        submission.createdAt
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;