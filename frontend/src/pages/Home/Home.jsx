import { Link } from "react-router-dom";
import {
  Compass,
  Map,
  Wallet,
  Images,
  BarChart3,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans">

      {/* Navbar */}
      <nav className="h-16 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#1E4631]/10 rounded-xl text-[#1E4631]">
              <Compass size={18} />
            </div>

            <h1 className="font-bold text-lg">
              Trip<span className="text-[#1E4631]">Crew</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-xl bg-[#1E4631] text-white text-sm font-semibold hover:bg-[#153122]"
            >
              Get Started
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>

            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#1E4631]/5 text-[#1E4631] text-xs font-semibold mb-6">
              ✈ Collaborative Travel Workspace
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Plan group trips
              <br />
              together.
              <br />
              Without the chaos.
            </h1>

            <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
              Create trips, invite friends, organize itineraries,
              split expenses, vote on decisions and capture memories
              in one shared workspace.
            </p>

            <div className="mt-10 flex gap-4">

              <Link
                to="/register"
                className="px-6 py-3 bg-[#1E4631] text-white rounded-xl font-semibold hover:bg-[#153122]"
              >
                Create Account
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-white"
              >
                Sign In
              </Link>

            </div>

          </div>

          {/* Right */}
          <div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6">

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg">
                    Goa Adventure
                  </h3>
                  <p className="text-sm text-gray-500">
                    12 Members
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                  Active
                </span>
              </div>

              <div className="space-y-4">

                <div className="bg-[#F4F7F5] rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Upcoming Activity
                  </p>
                  <p className="font-semibold">
                    Beach Day • Tomorrow
                  </p>
                </div>

                <div className="bg-[#F4F7F5] rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Shared Expenses
                  </p>
                  <p className="font-semibold">
                    ₹18,450 Tracked
                  </p>
                </div>

                <div className="bg-[#F4F7F5] rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Gallery Memories
                  </p>
                  <p className="font-semibold">
                    128 Photos Uploaded
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <Map size={24} className="text-[#1E4631]" />

            <h3 className="font-bold text-lg mt-5">
              Shared Itineraries
            </h3>

            <p className="text-gray-500 mt-3">
              Keep schedules organized with a
              single timeline everyone can update.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <Wallet size={24} className="text-[#1E4631]" />

            <h3 className="font-bold text-lg mt-5">
              Expense Tracking
            </h3>

            <p className="text-gray-500 mt-3">
              Track group spending and settlements
              without spreadsheets.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-8">
            <BarChart3 size={24} className="text-[#1E4631]" />

            <h3 className="font-bold text-lg mt-5">
              Polls & Decisions
            </h3>

            <p className="text-gray-500 mt-3">
              Vote on destinations, activities and
              travel plans together.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        Built for collaborative travel planning ✈
      </footer>

    </div>
  );
};

export default Home;