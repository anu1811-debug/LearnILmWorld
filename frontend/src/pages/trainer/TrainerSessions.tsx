import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, Video, Clock, User } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TrainerSessions = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sessions/my-sessions`);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Session State Updates ---------- */
  const updateSessionStatus = async (sessionId: string, status: string) => {
    await axios.put(
      `${API_BASE_URL}/api/sessions/${sessionId}/status`,
      { status }
    );
  };

  /* ---------- Trainer starts session ---------- */
  const handleStartSession = async (sessionId: string) => {
    try {
      await updateSessionStatus(sessionId, "active");
      navigate(`/session/${sessionId}`);
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  /* ---------- Trainer joins active session ---------- */
  const handleJoinSession = (sessionId: string) => {
    navigate(`/session/${sessionId}`);
  };

  /* ---------- Trainer ends session ---------- */
  const handleEndSession = async (sessionId: string) => {
    const confirmEnd = window.confirm("End this session for all participants?");
    if (!confirmEnd) return;

    try {
      await updateSessionStatus(sessionId, "ended");
      fetchSessions();
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-dots">
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">My Sessions</h2>
        <Link
          to="/trainer/students"
          className="inline-flex items-center justify-center
      px-4 py-2 rounded-xl bg-blue-600 text-white font-medium text-sm
    "
        >
          <Calendar className="h-4 w-4 mr-2" />
          Create New Session
        </Link>
      </div>

      {/* Sessions */}
      <div className="bg-white rounded-2xl p-4 shadow-md border">
        {sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session._id || session.id}
                className="p-4 sm:p-5 bg-gray-50 rounded-xl border"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="h-auto w-1.5 bg-[#5186CC] rounded-full"></div>
                    <div className="grid grid-col-1 gap-2" >
                      <h3 className="font-semibold flex gap-2 items-center text-sm sm:text-base">
                        <p>
                          <Video className="w-4 h-4 bg-gray-200 rounded-full text-gray-600" />
                        </p>
                        {session.title}</h3>
                      {/* Calculating date */}
                      <p className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(session.scheduledDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </p>
                      {/* Calculating time */}
                      <p className="flex items-center text-sm gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(session.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' - '}

                          {(() => {
                            const date = new Date(session.scheduledDate);
                            date.setMinutes(date.getMinutes() + session.duration);
                            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          })()}
                        </span>
                      </p>
                      <p className="text-blue-500 gap-2 flex  items-center font-medium text-sm mt-1">
                        <p>
                          <User className="w-4 h-4" />
                        </p>
                        {session.students?.length || 0} students enrolled
                      </p>
                    </div>
                  </div>

                  {/* Status + Actions */}
                  <div className="flex flex-row sm:flex-col  gap-2 justify-center items-center ">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-200 self-start sm:self-auto">
                      {session.status.toUpperCase()}
                    </span>

                    <div className="flex flex-wrap  gap-2">
                      {session.status === "scheduled" && (
                        <button
                          onClick={() => handleStartSession(session._id)}
                          className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-xs sm:text-sm"
                        >
                          Start
                        </button>
                      )}

                      {session.status === "active" && (
                        <>
                          <button
                            onClick={() => handleJoinSession(session._id)}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-xs sm:text-sm flex items-center"
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </button>

                          <button
                            onClick={() => handleEndSession(session._id)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs sm:text-sm"
                          >
                            End
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Calendar className="mx-auto h-7 w-7 text-gray-400" />
            <p className="mt-2 text-gray-600">No sessions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerSessions;
