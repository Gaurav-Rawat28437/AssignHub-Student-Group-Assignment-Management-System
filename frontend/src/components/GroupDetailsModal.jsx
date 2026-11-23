
import { X, Users, User, Mail, CalendarDays } from "lucide-react";
import { useEffect } from "react";

function GroupDetailsModal({ group, onClose }) {
  if (!group) return null;


  useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "";
  };
}, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Group Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete information about your group
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs text-slate-500">Group Name</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {group.name}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <User size={18} className="text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Created By</p>
              <p className="text-sm font-medium text-slate-800">
                {group.creator?.name || "Unknown"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Created On</p>
              <p className="text-sm font-medium text-slate-800">
                {new Date(group.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-slate-600" />
                <h3 className="font-semibold text-slate-800">
                  Group Members
                </h3>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {group.members?.length || 0} Members
              </span>
            </div>

            <div className="max-h-60 space-y-3 overflow-y-auto">
              {group.members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-200 font-semibold text-slate-700">
                    {member.user?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">
                      {member.user?.name}
                    </p>
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                      <Mail size={13} />
                      {member.user?.email}
                    </p>
                  </div>

                  {member.userId === group.createdById && (
                    <span className="text-xs font-medium text-blue-600">
                      Creator
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default GroupDetailsModal;
