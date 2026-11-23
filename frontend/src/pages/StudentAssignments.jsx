
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ExternalLink,
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  ClipboardList
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import StudentNavbar from "../components/StudentNavbar";
import {
  fetchDashboardData,
  confirmAssignment
} from "../utils/dashboardSlice";

function StudentAssignments() {
  const dispatch = useDispatch();

  const { assignments, groups, status } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleConfirm = async (assignmentId, groupId) => {
    try {
      const result = await dispatch(
        confirmAssignment({ assignmentId, groupId })
      ).unwrap();

      toast.success("Submission confirmed successfully");
    } catch (error) {
      toast.error(error || "Submission confirmation failed");
    }
  };

  const getAssignmentGroups = (assignment) => {
    if (assignment.assignToAll) {
      return groups;
    }

    const assignedGroupIds = assignment.groups?.map(
      (item) => item.groupId
    ) || [];

    return groups.filter((group) =>
      assignedGroupIds.includes(group.id)
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <StudentNavbar />

        <main className="p-6 sm:p-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Assignments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View and manage your assigned tasks.
            </p>
          </div>

          {status === "loading" && (
            <div className="mt-8 text-sm text-slate-500">
              Loading assignments...
            </div>
          )}

          {status === "failed" && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              Failed to load assignments. Please try again.
            </div>
          )}

          {status === "succeeded" && assignments.length === 0 && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center">
              <ClipboardList
                size={40}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 font-semibold text-slate-800">
                No assignments yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your assigned tasks will appear here.
              </p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {assignments.map((assignment) => {
              const assignmentGroups = getAssignmentGroups(assignment);

              const confirmedCount = assignmentGroups.filter((group) =>
                assignment.submissions?.some(
                  (submission) =>
                    submission.groupId === group.id &&
                    submission.confirmed
                )
              ).length;

              const isCompleted =
                assignmentGroups.length > 0 &&
                confirmedCount === assignmentGroups.length;

              return (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {assignment.title}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {assignment.description}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        isCompleted
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays size={17} />
                      <span>
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users size={17} />
                      <span>
                        {assignmentGroups
                          .map((group) => group.name)
                          .join(", ") || "No matching groups"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      {isCompleted ? (
                        <CheckCircle size={17} className="text-green-600" />
                      ) : (
                        <Clock size={17} className="text-orange-600" />
                      )}

                      <span>
                        {isCompleted
                          ? "Submission confirmed"
                          : `${confirmedCount} of ${assignmentGroups.length} groups confirmed`}
                      </span>
                    </div>
                  </div>

                  {assignmentGroups.map((group) => {
                    const isGroupConfirmed =
                      assignment.submissions?.some(
                        (submission) =>
                          submission.groupId === group.id &&
                          submission.confirmed
                      );

                    return (
                      <div
                        key={group.id}
                        className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {group.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {isGroupConfirmed
                              ? "Submission confirmed"
                              : "Confirmation required"}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            handleConfirm(assignment.id, group.id)
                          }
                          disabled={isGroupConfirmed}
                          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${
                            isGroupConfirmed
                              ? "cursor-not-allowed bg-green-50 text-green-700"
                              : "bg-slate-900 text-white hover:bg-slate-700"
                          }`}
                        >
                          {isGroupConfirmed ? "Confirmed" : "Confirm"}
                        </button>
                      </div>
                    );
                  })}

                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    Open Assignment
                    <ExternalLink size={16} />
                  </a>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentAssignments;
