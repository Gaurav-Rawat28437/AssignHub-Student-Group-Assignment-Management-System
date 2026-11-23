
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  User,
  CalendarDays,
  Mail,
  UsersRound
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import StudentNavbar from "../components/StudentNavbar";
import { fetchDashboardData } from "../utils/dashboardSlice";

function StudentGroups() {
  const dispatch = useDispatch();

  const { groups, status } = useSelector(
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

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <StudentNavbar />

        <main className="p-6 sm:p-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Groups
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              View your groups and their members.
            </p>
          </div>

          <div className="mt-8">
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
                  You are not a member of any group yet.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
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

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
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
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentGroups;
