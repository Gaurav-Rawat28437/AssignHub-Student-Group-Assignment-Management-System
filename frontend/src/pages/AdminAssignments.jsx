
import { useEffect, useState } from "react";
import {
  Search,
  ClipboardList,
  Plus,
  Pencil,
  X,
  CalendarDays,
  ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import { getAllAssignments, createAssignment, updateAssignment } from "../services/adminAssignmentService";
import { getAllGroups } from "../services/adminGroupService";

function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    dueDate: "",
    assignToAll: true,
    groupIds: []
  });

  const fetchData = async () => {
    try {
      const [assignmentResponse, groupResponse] = await Promise.all([
        getAllAssignments(),
        getAllGroups()
      ]);

      setAssignments(assignmentResponse.assignments || []);
      setGroups(groupResponse.groups || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load assignments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleGroupChange = (groupId) => {
    setFormData((previous) => ({
      ...previous,
      groupIds: previous.groupIds.includes(groupId)
        ? previous.groupIds.filter((id) => id !== groupId)
        : [...previous.groupIds, groupId]
    }));
  };

  const openCreateForm = () => {
    setEditingAssignment(null);
    setFormData({
      title: "",
      description: "",
      fileUrl: "",
      dueDate: "",
      assignToAll: true,
      groupIds: []
    });
    setShowForm(true);
  };

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);

    setFormData({
      title: assignment.title,
      description: assignment.description,
      fileUrl: assignment.fileUrl,
      dueDate: new Date(assignment.dueDate).toISOString().slice(0, 16),
      assignToAll: assignment.assignToAll,
      groupIds: assignment.groups?.map((item) => item.groupId) || []
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.assignToAll && formData.groupIds.length === 0) {
      toast.error("Please select at least one group");
      return;
    }

    setSaving(true);

    try {
      const assignmentData = {
        ...formData,
        groupIds: formData.assignToAll ? [] : formData.groupIds
      };

      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, assignmentData);
        toast.success("Assignment updated successfully");
      } else {
        await createAssignment(assignmentData);
        toast.success("Assignment created successfully");
      }

      setShowForm(false);
      setEditingAssignment(null);
      await fetchData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save assignment"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />

      <div className="ml-[76px] min-w-0 transition-all duration-300 peer-hover:ml-[260px]">
        <AdminNavbar />

        <main className="p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Assignments Management
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create, update and manage student assignments.
              </p>
            </div>

            <button
              onClick={openCreateForm}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              <Plus size={18} />
              Create Assignment
            </button>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
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
              <table className="w-full min-w-[750px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="px-4 py-4 font-medium">Assignment</th>
                    <th className="px-4 py-4 font-medium">Due Date</th>
                    <th className="px-4 py-4 font-medium">Assigned To</th>
                    <th className="px-4 py-4 font-medium">Created By</th>
                    <th className="px-4 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
                        Loading assignments...
                      </td>
                    </tr>
                  ) : filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-sm text-slate-500">
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

                          <a
                            href={assignment.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            Open assignment <ExternalLink size={12} />
                          </a>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <CalendarDays size={16} className="text-slate-400" />
                            {new Date(assignment.dueDate).toLocaleDateString("en-IN")}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {assignment.assignToAll
                            ? "All Groups"
                            : assignment.groups?.map((item) => item.group?.name).join(", ")}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {assignment.creator?.name}
                        </td>

                        <td className="px-4 py-4">
                          <button
                            onClick={() => openEditForm(assignment)}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </p>
          </div>
        </main>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {editingAssignment ? "Edit Assignment" : "Create Assignment"}
              </h3>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Assignment Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Enter assignment title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Enter assignment description"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  OneDrive / Assignment Link
                </label>

                <input
                  type="url"
                  name="fileUrl"
                  value={formData.fileUrl}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Due Date
                </label>

                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    name="assignToAll"
                    checked={formData.assignToAll}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  Assign to all groups
                </label>

                {!formData.assignToAll && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium text-slate-700">
                      Select groups
                    </p>

                    {groups.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        No groups available.
                      </p>
                    ) : (
                      groups.map((group) => (
                        <label
                          key={group.id}
                          className="flex items-center gap-3 text-sm text-slate-600"
                        >
                          <input
                            type="checkbox"
                            checked={formData.groupIds.includes(group.id)}
                            onChange={() => handleGroupChange(group.id)}
                            className="h-4 w-4"
                          />
                          {group.name}
                        </label>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingAssignment
                    ? "Update Assignment"
                    : "Create Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminAssignments;
