
import { useEffect, useState } from "react";
import {
  Users,
  UsersRound,
  ClipboardList,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { getAdminAnalytics } from "../services/adminService";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAdminAnalytics();
        setAnalytics(response);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: analytics?.totalStudents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Total Groups",
      value: analytics?.totalGroups,
      icon: UsersRound,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Total Assignments",
      value: analytics?.totalAssignments,
      icon: ClipboardList,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      title: "Confirmed Submissions",
      value: analytics?.totalConfirmedSubmissions,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="ml-[76px] min-w-0 transition-all duration-300 peer-hover:ml-[260px]">
        <AdminNavbar />

        <main className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Monitor students, groups, assignments and submissions.
          </p>

          {loading ? (
            <p className="mt-8 text-sm text-slate-500">
              Loading dashboard...
            </p>
          ) : analytics ? (
            <>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.title}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                          {card.title}
                        </p>

                        <div
                          className={`rounded-lg p-3 ${card.bg} ${card.color}`}
                        >
                          <Icon size={22} />
                        </div>
                      </div>

                      <h3 className="mt-4 text-3xl font-bold text-slate-900">
                        {card.value ?? 0}
                      </h3>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-blue-600" size={22} />

                  <h3 className="font-semibold text-slate-900">
                    Overall Submission Progress
                  </h3>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Completion
                  </span>

                  <span className="text-lg font-bold text-slate-900">
                    {analytics.progressPercentage ?? 0}%
                  </span>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, analytics.progressPercentage ?? 0)
                      )}%`
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {analytics.totalConfirmedSubmissions ?? 0} of{" "}
                  {analytics.expectedSubmissions ?? 0} expected submissions confirmed.
                </p>
              </div>
            </>
          ) : (
            <p className="mt-8 text-sm text-slate-500">
              Dashboard analytics are unavailable.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
