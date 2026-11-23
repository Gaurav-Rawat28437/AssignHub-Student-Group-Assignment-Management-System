
import { useEffect, useState } from "react";
import { Search, Users, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { getAllStudents } from "../services/adminStudentService";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudents();
        setStudents(response.students || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const name = student.name?.toLowerCase() || "";
    const email = student.email?.toLowerCase() || "";
    const searchValue = search.toLowerCase();

    return (
      name.includes(searchValue) ||
      email.includes(searchValue)
    );
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="ml-[76px] min-w-0 transition-all duration-300 peer-hover:ml-[260px]">
        <AdminNavbar />

        <main className="p-6 sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Students Management
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View and manage all registered students.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={24} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Students
                </p>

                <h3 className="text-2xl font-bold text-slate-900">
                  {students.length}
                </h3>
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
                placeholder="Search by student name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-4 font-medium">Student</th>
                    <th className="px-4 py-4 font-medium">Email</th>
                    <th className="px-4 py-4 font-medium">Registration Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-10 text-center text-sm text-slate-500">
                        Loading students...
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-10 text-center text-sm text-slate-500">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                              {student.name?.charAt(0)?.toUpperCase() || "S"}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-800">
                                {student.name}
                              </p>
                              <p className="text-xs text-slate-400">
                                ID: {student.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {student.email}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CalendarDays size={16} className="text-slate-400" />
                            {new Date(student.createdAt).toLocaleDateString("en-IN")}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminStudents;
