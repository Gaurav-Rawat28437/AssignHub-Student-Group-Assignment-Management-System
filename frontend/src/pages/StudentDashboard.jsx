
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  ClipboardList,
  CheckCircle,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import StudentNavbar from "../components/StudentNavbar";
import { fetchDashboardData } from "../utils/dashboardSlice";

function StudentDashboard() {
  const dispatch = useDispatch();

  const {
    groupCount,
    assignmentCount,
    assignments,
    status,
    error
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  const completedCount = assignments.filter((assignment) =>
    assignment.submissions?.some(
      (submission) => submission.confirmed
    )
  ).length;

  const pendingCount = assignments.length - completedCount;

  const cards = [
    {
      title: "My Groups",
      count: groupCount,
      description: "Groups you belong to",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Total Assignments",
      count: assignmentCount,
      description: "Assignments available",
      icon: ClipboardList,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Completed Assignments",
      count: completedCount,
      description: "Assignments confirmed",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      title: "Pending Assignments",
      count: pendingCount,
      description: "Assignments awaiting confirmation",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

     <div className="ml-[76px] min-w-0 flex-1 transition-all duration-300 peer-hover:ml-[260px]">
        <StudentNavbar />

        <main className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome to your AssignHub dashboard.
          </p>

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

                    <div className={`rounded-lg p-3 ${card.bg} ${card.color}`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <h2 className="mt-4 text-3xl font-bold text-slate-900">
                    {status === "loading" && "..." }
                    {status !== "loading" && card.count}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
