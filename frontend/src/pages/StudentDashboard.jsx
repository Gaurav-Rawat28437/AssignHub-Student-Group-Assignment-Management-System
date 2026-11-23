
import Sidebar from "../components/Sidebar";
import StudentNavbar from "../components/StudentNavbar";

function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">

      <Sidebar />

      <div className="min-w-0 flex-1">

        <StudentNavbar />

        <main className="p-6 sm:p-8">

          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome to your AssignHub dashboard.
          </p>

        </main>

      </div>

    </div>
  );
}

export default StudentDashboard;
