
import { useSelector } from "react-redux";

function AdminNavbar() {
  const currentUser = useSelector(
    (state) => state.user.user
  );

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white/90 px-4 backdrop-blur sm:px-6">

      <div>
        <h2 className="font-semibold text-slate-900">
          Admin Dashboard
        </h2>

        <p className="text-xs text-slate-400">
          Welcome back
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">
            {currentUser?.name}
          </p>

          <p className="text-xs text-slate-400">
            Administrator
          </p>
        </div>

        <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-sm font-bold text-white">
          {currentUser?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>

      </div>
    </header>
  );
}

export default AdminNavbar;
