// src/pages/EducatorDashboard.jsx
import React, { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, Users, Calendar, User, Star, LogOut, Menu,

  NutIcon,
  Bell,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import bg_img from '../../assets/bg_dashboard.jpeg'
import logo from '../../assets/logo2.png'
import TrainerHome from './TrainerHome'
import TrainerSessions from './TrainerSessions'
import TrainerStudents from './TrainerStudents'
import TrainerReviews from './TrainerReviews'
import TrainerProfile from './TrainerProfile'



// // src/pages/trainer/TrainerProfile.tsx
// import { useState, useEffect, ChangeEvent } from "react";
// import { useAuth } from '../../contexts/AuthContext'
// import ReactFlagsSelect from "react-flags-select";


/* ---------- TrainerHome ---------- */
// const FRONTEND_URL= import.meta.env.VITE_FRONTEND_URL;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 




/* ---------------- EducatorDashboard (root) ---------------- */
const EducatorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/trainer", icon: Home },
    { name: "My Sessions", href: "/trainer/sessions", icon: Calendar },
    { name: "Students", href: "/trainer/students", icon: Users },
    { name: "Reviews", href: "/trainer/reviews", icon: Star },
    { name: "Profile", href: "/trainer/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/trainer")
      return location.pathname === "/trainer" || location.pathname === "/trainer/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-fixed overflow-x-hidden ">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#5186CC] p-6 
        transform transition-transform duration-300 flex flex-col no-scrollbar shadow-xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center mb-10 hover:opacity-90 transition gap-3"
          >
            <img
              src={logo}
              alt="LearniLM"
              className="w-full "
            />
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

      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">

        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">

            {/* Left: Hamburger & Title */}
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-lg bg-[#5186CC] text-white hover:bg-blue-700 transition"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="hidden lg:block text-2xl font-bold text-gray-800">
                Trainer Dashboard
              </h1>
            </div>

            {/* Right: User Profile & Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  {user?.profile?.imageUrl ? (
                    <img src={user.profile.imageUrl} className="w-full h-full object-cover" alt="User" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                {/* User Name  Hide on mobile  */}
                <span className="hidden sm:block text-gray-700 font-semibold">
                  {user?.name || "Unknown"}
                </span>
              </div>
            </div>

          </div>
        </header>
      </div>
      {/* Main Content */}
      <div className="pt-3 lg:pl-64">
        <div className="p-6">
          <Routes>
            <Route index element={<TrainerHome />} />
            <Route path="sessions" element={<TrainerSessions />} />
            <Route path="students" element={<TrainerStudents />} />
            <Route path="reviews" element={<TrainerReviews />} />
            <Route path="profile" element={<TrainerProfile />} />
          </Routes>
        </div>
      </div>
    </div>




  );
};


export default EducatorDashboard