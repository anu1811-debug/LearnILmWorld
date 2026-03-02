// src/pages/StudentDashboard.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Home, Calendar, User, Menu, Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/logo2.png";

import StudentHome from "./StudentHome";
import StudentLanding from "./StudentLanding";
import StudentSessions from "./StudentSessions";
import StudentProfile from "./StudentProfile";
import axios from "axios";

type AnyObj = Record<string, any>;

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth() as AnyObj;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewLink, setPreviewLink] = useState<string>("") //for preview of the image
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigation = [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Home", href: "/student/home", icon: Home },
    { name: "My Sessions", href: "/student/sessions", icon: Calendar },
    { name: "Profile", href: "/student/profile", icon: User },
  ];

  useEffect(() => {
    const fetchProfileImage = async () => {
      
      if (!user?.profile?.imageUrl) {
        setPreviewLink(""); 
        return;
      }
      try {
        const { data } = await axios.post(`${API_BASE_URL}/api/upload/get-download-url`, {
          fileKey: user.profile.imageUrl
        });
        setPreviewLink(data.signedUrl);
      } catch (err) {
        console.error("Failed to load profile image", err);
      }
    };

    fetchProfileImage();
  }, [user]);

  const isActive = (path: string) => {
    if (path === "/student")
      return location.pathname === "/student" || location.pathname === "/student/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-fixed overflow-x-hidden">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#5186CC] p-6
        transform transition-transform duration-300 flex flex-col no-scrollbar shadow-xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center mb-10 hover:opacity-90 transition gap-3"
          >
            <img src={logo} alt="LearniLM" className="w-full" />
          </Link>

          {/* Navigation */}
          <nav className="space-y-3">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${active
                      ? "bg-white/20 text-white font-bold shadow-sm"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={logout}
            className="w-full bg-white text-[#5186CC] py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition"
          >
            Log Out →
          </button>
        </div>
      </div>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">

        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">

            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg bg-[#5186CC] text-white hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <h1 className="hidden lg:block text-2xl font-bold text-gray-800">
                Student Dashboard
              </h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {previewLink ? (
                <img
                  src={previewLink} 
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <span className="hidden sm:block text-gray-700 font-semibold">
                  {user?.name || "Student"}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* CONTENT */}
        <main className="p-6">
          <Routes>
            <Route index element={<StudentHome />} />
            <Route path="home" element={<StudentLanding />} />
            <Route path="sessions" element={<StudentSessions />} />
            <Route path="profile" element={<StudentProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
