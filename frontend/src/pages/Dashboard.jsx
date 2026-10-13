import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/api/dashboard");
        setDashboard(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return (
      <div className="p-8 text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Track your coding progress and submission activity.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Total Submissions
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.totalSubmissions}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Accepted
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {dashboard.acceptedSubmissions}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Problems Solved
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.solvedProblems}
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm text-gray-500">
              Success Rate
            </p>

            <p className="mt-2 text-3xl font-bold">
              {dashboard.successRate}%
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-lg bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold">
              Recent Submissions
            </h2>
          </div>

          {dashboard.recentSubmissions.length === 0 ? (
            <div className="p-6 text-gray-500">
              No submissions yet.
            </div>
          ) : (
            <div className="divide-y">
              {dashboard.recentSubmissions.map(
                (submission) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-6"
                  >
                    <div>
                      <p className="font-semibold">
                        {submission.problem?.title}
                      </p>

                      <p className="text-sm text-gray-500">
                        {submission.language} •{" "}
                        {new Date(
                          submission.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          submission.status === "Accepted"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {submission.status}
                      </p>

                      <p className="text-sm text-gray-500">
                        {submission.passedTests}/
                        {submission.totalTests} tests
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;