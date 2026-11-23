
import { useEffect, useState } from "react";
import {
  Search,
  Users,
  Eye,
  X,
  CalendarDays
} from "lucide-react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { getAllGroups } from "../services/adminGroupService";

function AdminGroups() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await getAllGroups();
        setGroups(response.groups || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch groups"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="ml-[76px] min-w-0 transition-all duration-300 peer-hover:ml-[260px]">
        <AdminNavbar />

        <main className="p-6 sm:p-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Groups Management
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View all groups, creators and group members.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <Users size={24} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Groups
                </p>

                <h3 className="text-2xl font-bold text-slate-900">
                  {groups.length}
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
                placeholder="Search groups by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-4 font-medium">Group</th>
                    <th className="px-4 py-4 font-medium">Creator</th>
                    <th className="px-4 py-4 font-medium">Members</th>
                    <th className="px-4 py-4 font-medium">Created</th>
                    <th className="px-4 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                        Loading groups...
                      </td>
                    </tr>
                  ) : filteredGroups.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                        No groups found.
                      </td>
                    </tr>
                  ) : (
                    filteredGroups.map((group) => (
                      <tr
                        key={group.id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-800">
                            {group.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {group.id}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {group.creator?.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {group.creator?.email}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                            {group.members?.length || 0} Members
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-slate-400" />
                            {new Date(group.createdAt).toLocaleDateString("en-IN")}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => setSelectedGroup(group)}
                            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredGroups.length} of {groups.length} groups
            </p>
          </div>
        </main>
      </div>

      {selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedGroup.name}
              </h3>

              <button
                onClick={() => setSelectedGroup(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800">
                Group Creator
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {selectedGroup.creator?.name}
              </p>

              <p className="text-sm text-slate-500">
                {selectedGroup.creator?.email}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-800">
                  Group Members
                </h4>

                <span className="text-sm text-slate-500">
                  {selectedGroup.members?.length || 0} members
                </span>
              </div>

              <div className="mt-3 max-h-64 space-y-3 overflow-y-auto">
                {selectedGroup.members?.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {member.user?.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {member.user?.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {member.user?.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedGroup(null)}
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

export default AdminGroups;
