// src/pages/student/StudentHome.tsx
import { BookOpen, Calendar, Star, User, TrendingUp } from "lucide-react";
// MessageCircle, Globe, Users => removed these unused lucide icons
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatPill from "./components/StarPill";


/* ---------- Types ---------- */
type AnyObj = Record<string, any>

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const weeklyActivity = [
  { day: "Mon", classes: 1 },
  { day: "Tue", classes: 3 },
  { day: "Wed", classes: 1 },
  { day: "Thu", classes: 2 },
  { day: "Fri", classes: 1 },
  { day: "Sat", classes: 0 },
  { day: "Sun", classes: 0 },
]


/* ---------------- StudentDashboard ---------------- */
const StudentHome: React.FC = () => {
  const { user } = useAuth() as AnyObj
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    totalSpent: 0
  })
  const [recentSessions, setRecentSessions] = useState<AnyObj[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, bookingsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/sessions/my-sessions`),
        axios.get(`${API_BASE_URL}/api/bookings/my-bookings`)
      ])

      const sessions = Array.isArray(sessionsRes.data) ? sessionsRes.data : []
      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : []

      setStats({
        totalSessions: sessions.length,
        upcomingSessions: sessions.filter((s: AnyObj) => s.status === 'scheduled').length,
        completedSessions: sessions.filter((s: AnyObj) => s.status === 'completed').length,
        totalSpent: bookings.reduce((sum: number, b: AnyObj) => sum + (b.amount || 0), 0)
      })

      setRecentSessions(sessions.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1250px] mx-auto px-6 py-8 space-y-8 bg-[#F5F7FB] min-h-screen">

      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-gray-800">
          Welcome back, {user?.name || "Student"}! 👋
        </h1>
        <p className="text-gray-500">
          You're making great progress. Keep up the learning momentum!
        </p>
      </div>


      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Sessions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {stats.totalSessions ?? 0}
          </p>
          <p className="text-xs text-blue-500 font-medium mt-1">
            All booked sessions
          </p>
        </div>

        {/* Completed Sessions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Sessions Completed</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {stats.completedSessions ?? 0}
          </p>
          <p className="text-xs text-green-600 font-medium mt-1">
            Successfully attended
          </p>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming Sessions</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {stats.upcomingSessions ?? 0}
          </p>
          <p className="text-xs text-blue-500 font-medium mt-1">
            Scheduled ahead
          </p>
        </div>

        {/* Avg Progress */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-gray-500">Avg Progress</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {stats.avgProgress ?? 0}%
          </p>
          <p className="text-xs text-purple-600 font-medium mt-1">
            Learning progress
          </p>
        </div>

      </div>



      {/* ================= PROGRESS ANALYTICS ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Progress Analytics
            </h2>
            <p className="text-sm text-gray-500">
              Track your learning journey
            </p>
          </div>

          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
            +5% this week
          </span>
        </div>

        {/* Segmented Tabs (visual only) */}
        <div className="flex bg-gray-100 rounded-full p-1 w-fit mx-auto my-6">
          <button className="px-6 py-2 rounded-full text-sm text-gray-600">
            Daily
          </button>
          <button className="px-6 py-2 rounded-full bg-blue-500 text-white text-sm font-medium shadow">
            Weekly
          </button>
          <button className="px-6 py-2 rounded-full text-sm text-gray-600">
            Monthly
          </button>
        </div>

        {/* Chart Container */}
        <div className="mt-6 rounded-xl border border-gray-200 p-4">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="classes"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>


      {/* ================= RECENT SESSIONS ================= */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Recent Sessions
          </h2>

          <Link
            to="/student/sessions"
            className="text-blue-600 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session._id || session.id}
                className="flex justify-between items-center p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold">{session.title}</p>
                  <p className="text-sm text-gray-500">
                    with {session.trainer?.name}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${session.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">
            No sessions yet
          </p>
        )}

      </div>

    </div>
  );


}

export default StudentHome;
