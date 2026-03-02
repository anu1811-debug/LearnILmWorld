import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { StripeProvider } from './contexts/StripeContext'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components
import PrivateRoute from './components/PrivateRoute'
import LandingPage from './pages/LandingPage'
import MainPage from './pages/MainPage'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/student/StudentDashboard'
import EducatorDashboard from './pages/trainer/EducatorDashboard'
import BookingPage from './pages/BookingPage'
import SessionRoom from './pages/SessionRoom'
import TrainerProfile from './pages/TrainerProfile'
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import BecomeTrainer from './pages/BecomeTrainer';
import AboutPage from './pages/AboutPage';
import StudentJoinSession from './components/StudentJoinSession';
import Chatbot from './components/Chatbot/Chatbot';
import { CurrencyProvider } from './contexts/CurrencyContext'
import ScrollToTop from './components/ScrollToTop'
import Courses from './pages/Course'
import CoursePlayer from './components/CoursePlayer'
import FeaturedTrainersPage from './pages/FeaturedTrainersPage'
import TrainerProfilePageDemo from './pages/TrainerProfilePageDemo'
import GermanBlog from './pages/blogs/GermanBlog';
import BengaliBlog from './pages/blogs/BengaliBlog';
import VerifyEmail from './pages/VerifyEmail';
import ScrollRestoration from './components/ScrollRestoration';
import BlogPage from './pages/BlogPage';
import Careers from './pages/Careers';
import BookPrivateSession from './pages/student/BookPrivateSession';
import BookGroupSession from './components/BookGroupSession';

function App() {
  return (

    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <StripeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <Router>

              <Chatbot />

              <ScrollRestoration />
              <ScrollToTop />


              <div className="min-h-screen bg-gradient-to-r from-white via-white to-[#79A2CE4D] font-Limerick">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/main" element={<MainPage />} />
                  <Route path="/become-trainer" element={<BecomeTrainer />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/forget-password" element={<ForgotPassword />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />

                  <Route path="/trainer-profile/:trainerId" element={<TrainerProfile />} />
                  <Route path="/book/:trainerId" element={<BookingPage />} />

                  {/* Courses */}
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CoursePlayer />} />
                  <Route path="/demo" element={<FeaturedTrainersPage />} />

                  {/* BLOG */}
                  <Route path='/blog' element={<BlogPage />} />
                  <Route path="/blog/german-culture" element={<GermanBlog />} />
                  <Route path="/blog/bengali-culture" element={<BengaliBlog />} />

                  {/* Careers */}
                  <Route path='/careers' element={<Careers />} />

                  <Route path="/student/*" element={
                    <PrivateRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/book/private/:trainerId" element={<BookPrivateSession />} />
                  <Route path="/book/group/:trainerId" element={<BookGroupSession />} />

                  <Route path="/admin/*" element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </PrivateRoute>
                  } />

                  <Route path="/trainer/profile/:id" element={<TrainerProfilePageDemo />} />


                  <Route
                    path="/trainer/*"
                    element={
                      <PrivateRoute allowedRoles={['trainer']}>
                        <EducatorDashboard />
                      </PrivateRoute>
                    }
                  />

                  <Route path="/student/session/:id" element={<StudentJoinSession />} />

                  <Route path="/session/:sessionId" element={
                    <PrivateRoute allowedRoles={['student', 'trainer']}>
                      <SessionRoom />
                    </PrivateRoute>
                  } />
                </Routes>
              </div>
            </Router>
          </CurrencyProvider>
        </AuthProvider>
      </StripeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;