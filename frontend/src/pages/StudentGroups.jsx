
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Users,
    User,
    CalendarDays,
    Mail,
    UsersRound,
    Plus,
    UserPlus,
    Trash2,
    Eye
} from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import StudentNavbar from "../components/StudentNavbar";
import GroupDetailsModal from "../components/GroupDetailsModal";

import {
    fetchDashboardData,
    createStudentGroup,
    addStudentGroupMember,
    deleteStudentGroup
} from "../utils/dashboardSlice";

import { getGroupById } from "../services/groupService";

function StudentGroups() {
    const dispatch = useDispatch();

    const { groups, status } = useSelector(
        (state) => state.dashboard
    );

    const currentUser = useSelector(
        (state) => state.user.user
    );

    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);
    const [memberEmails, setMemberEmails] = useState({});
    const [addingMember, setAddingMember] = useState(null);
    const [deletingGroup, setDeletingGroup] = useState(null);

    const [selectedGroup, setSelectedGroup] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

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

    const handleCreateGroup = async (e) => {
        e.preventDefault();

        if (!groupName.trim()) {
            toast.error("Please enter a group name");
            return;
        }

        try {
            setLoading(true);

            await dispatch(
                createStudentGroup(groupName.trim())
            ).unwrap();

            toast.success("Group created successfully");
            setGroupName("");
        } catch (error) {
            toast.error(error || "Failed to create group");
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e, groupId) => {
        e.preventDefault();

        const email = memberEmails[groupId]?.trim();

        if (!email) {
            toast.error("Please enter student email");
            return;
        }

        try {
            setAddingMember(groupId);

            await dispatch(
                addStudentGroupMember({ groupId, email })
            ).unwrap();

            toast.success("Member added successfully");

            setMemberEmails((prev) => ({
                ...prev,
                [groupId]: ""
            }));
        } catch (error) {
            toast.error(error || "Failed to add member");
        } finally {
            setAddingMember(null);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this group? Its members and related submission records will also be deleted. This action cannot be undone."
        );

        if (!confirmed) return;

        try {
            setDeletingGroup(groupId);

            await dispatch(
                deleteStudentGroup(groupId)
            ).unwrap();

            toast.success("Group deleted successfully");
        } catch (error) {
            toast.error(error || "Failed to delete group");
        } finally {
            setDeletingGroup(null);
        }
    };

    const handleViewDetails = async (groupId) => {
        try {
            setLoadingDetails(true);
            setSelectedGroup(null);

            const response = await getGroupById(groupId);

            setSelectedGroup(response.group);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch group details"
            );
        } finally {
            setLoadingDetails(false);
        }
    };

  

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <Sidebar />

            <div className="ml-[76px] min-w-0 flex-1 transition-all duration-300 peer-hover:ml-[260px]">
                <StudentNavbar />

                <main className="p-6 sm:p-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            My Groups
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Create groups and manage your group members.
                        </p>
                    </div>

                    <form
                        onSubmit={handleCreateGroup}
                        className="mt-8 max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                <Plus size={22} />
                            </div>

                            <div>
                                <h2 className="font-semibold text-slate-900">
                                    Create New Group
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Create a group for your assignment.
                                </p>
                            </div>
                        </div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Group Name
                        </label>

                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </form>

                    <div className="mt-10">
                        <h2 className="mb-5 text-lg font-semibold text-slate-900">
                            Your Groups
                        </h2>

                        {status === "loading" && (
                            <p className="text-sm text-slate-500">
                                Loading groups...
                            </p>
                        )}

                        {status === "failed" && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                                Failed to load groups. Please try again.
                            </div>
                        )}

                        {status === "succeeded" && groups.length === 0 && (
                            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                                <UsersRound
                                    size={40}
                                    className="mx-auto text-slate-300"
                                />

                                <h2 className="mt-4 font-semibold text-slate-800">
                                    No groups yet
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Create your first group to get started.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                                <UsersRound size={22} />
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-semibold text-slate-900">
                                                    {group.name}
                                                </h2>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Group ID: {group.id}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                            {group.members?.length || 0} Members
                                        </span>
                                    </div>

                                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <User size={17} />

                                            <span>
                                                Created by: {group.creator?.name || "Unknown"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <CalendarDays size={17} />

                                            <span>
                                                Created on: {formatDate(group.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleViewDetails(group.id)}
                                        disabled={loadingDetails}
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Eye size={17} />
                                        {loadingDetails ? "Loading Details..." : "View Details"}
                                    </button>

                                    <div className="mt-6 border-t border-slate-100 pt-5">
                                        <div className="mb-4 flex items-center gap-2">
                                            <Users size={18} className="text-slate-600" />

                                            <h3 className="font-semibold text-slate-800">
                                                Group Members
                                            </h3>
                                        </div>

                                        <div className="space-y-3">
                                            {group.members?.map((member) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                                                >
                                                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                                        {member.user?.name?.charAt(0).toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-slate-800">
                                                            {member.user?.name}
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                            <Mail size={13} />

                                                            <span className="truncate">
                                                                {member.user?.email}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {member.userId === group.createdById && (
                                                        <span className="ml-auto text-xs font-medium text-blue-600">
                                                            Creator
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {group.createdById === currentUser?.id && (
                                        <>
                                            <form
                                                onSubmit={(e) => handleAddMember(e, group.id)}
                                                className="mt-6 border-t border-slate-100 pt-5"
                                            >
                                                <div className="mb-4 flex items-center gap-2">
                                                    <UserPlus size={18} className="text-slate-600" />

                                                    <h3 className="font-semibold text-slate-800">
                                                        Add Group Member
                                                    </h3>
                                                </div>

                                                <input
                                                    type="email"
                                                    value={memberEmails[group.id] || ""}
                                                    onChange={(e) =>
                                                        setMemberEmails((prev) => ({
                                                            ...prev,
                                                            [group.id]: e.target.value
                                                        }))
                                                    }
                                                    placeholder="Enter registered student email"
                                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                                />

                                                <button
                                                    type="submit"
                                                    disabled={addingMember === group.id}
                                                    className="mt-3 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                    {addingMember === group.id
                                                        ? "Adding..."
                                                        : "Add Member"}
                                                </button>
                                            </form>

                                            <div className="mt-5 border-t border-slate-100 pt-5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGroup(group.id)}
                                                    disabled={deletingGroup === group.id}
                                                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />

                                                    {deletingGroup === group.id
                                                        ? "Deleting..."
                                                        : "Delete Group"}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {selectedGroup && (
                <GroupDetailsModal
                    group={selectedGroup}
                    onClose={() => setSelectedGroup(null)}
                />
            )}
        </div>
    );
}

export default StudentGroups;
