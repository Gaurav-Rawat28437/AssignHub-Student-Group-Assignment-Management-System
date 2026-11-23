
import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  ClipboardList,
  Eye,
  X,
  Users
} from "lucide-react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { getAllAssignments } from "../services/adminAssignmentService";
import { getAssignmentProgress } from "../services/adminSubmissionService";

function AdminSubmissions() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await getAllAssignments();
        setAssignments(response.assignments || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch assignments"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewProgress = async (assignment) => {
    setSelectedAssignment(assignment);
    setProgress(null);
    setLoadingProgress(true);

    try {
      const response = await getAssignmentProgress(assignment.id);
      setProgress(response);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch submission progress"
      );
      setSelectedAssignment(null);
    } finally {
      setLoadingProgress(false);
    }
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setProgress(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="ml-[76px] min-w-0 transition-all duration-300 peer-hover:ml-[260px]">
        <AdminNavbar />

        <main className="p-6 sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Submissions Management
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Monitor assignment confirmations and student progress.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                  <ClipboardList size={24} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Total Assignments
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {assignments.length}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Users size={24} />
                </div>

                <div>
                  <p className="text-sm text-slate-500">
                    Available Assignments
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    {assignments.length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search assignments by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-4 font-medium">Assignment</th>
                    <th className="px-4 py-4 font-medium">Due Date</th>
                    <th className="px-4 py-4 font-medium">Assigned Groups</th>
                    <th className="px-4 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-sm text-slate-500">
                        Loading assignments...
                      </td>
                    </tr>
                  ) : filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-sm text-slate-500">
                        No assignments found.
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <tr
                        key={assignment.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-800">
                            {assignment.title}
                          </p>

                          <p className="text-xs text-slate-400">
                            ID: {assignment.id}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {new Date(assignment.dueDate).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {assignment.assignToAll
                            ? "All Groups"
                            : assignment.groups?.length || 0}
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleViewProgress(assignment)}
                            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
                          >
                            <Eye size={16} />
                            View Progress
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Submission Progress
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedAssignment.title}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {loadingProgress ? (
              <p className="py-12 text-center text-sm text-slate-500">
                Loading progress...
              </p>
            ) : progress ? (
              <>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    ["Groups", progress.totalGroups],
                    ["Students", progress.totalStudents],
                    ["Confirmed", progress.totalConfirmed],
                    ["Pending", progress.totalStudents - progress.totalConfirmed]
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value ?? 0}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 max-h-[55vh] space-y-5 overflow-y-auto">
                  {progress.groups?.map((group) => (
                    <div
                      key={group.groupId}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <h4 className="font-semibold text-slate-800">
                          {group.groupName}
                        </h4>

                        <span className="text-sm font-medium text-slate-600">
                          {group.confirmedCount}/{group.totalMembers} confirmed
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{
                            width: `${group.progressPercentage}%`
                          }}
                        />
                      </div>

                      <p className="mt-2 text-right text-xs text-slate-500">
                        {group.progressPercentage}% complete
                      </p>

                      <div className="mt-4 space-y-3">
                        {group.members?.map((member) => (
                          <div
                            key={member.student.id}
                            className="flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {member.student.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                {member.student.email}
                              </p>
                            </div>

                            {member.confirmed ? (
                              <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                <CheckCircle size={14} />
                                Confirmed
                              </span>
                            ) : (
                              <span className="flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                                <Clock size={14} />
                                Pending
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-10 text-center text-sm text-slate-500">
                Progress data is unavailable.
              </p>
            )}

            <button
              onClick={closeModal}
              className="mt-6 w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSubmissions;
