import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
// , User - removed from above
import "../theme.css"; // ensure theme is imported (or import once in index.tsx)
import { GoogleLogin } from "@react-oauth/google";
import { useFacebook } from "../hooks/useFacebook";

// interface LoginResult {
//   success: boolean
//   user?: User
//   error?: string
//   data?: any
// }

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { facebookLogin } = useAuth()
  const { loginWithFacebook } = useFacebook()

  const location = useLocation();

  useEffect(() => {
    if (location.state?.trainerPending) {
      setError("Registration successful. Please wait for admin approval before logging in.");
    }
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const extractUserObject = (result: any) => {
  //   if (!result || typeof result !== 'object') return null

  //   // Common shapes:
  //   // { user: {...}, success: true }
  //   // { data: { user: {...} } }
  //   // { data: {...userProps...} }
  //   // { user: {...} } or directly user object
  //   if ('user' in result && result.user) return result.user
  //   if ('data' in result) {
  //     if (result.data?.user) return result.data.user
  //     // if data itself looks like a user object
  //     return result.data
  //   }
  //   // fallback when login returns the user directly
  //   return result
  // }

  // const getRoleFromObject = (userObj: any) => {
  //   if (!userObj) return ''
  //   // role could be in different keys or nested
  //   return (
  //     userObj.role ??
  //     userObj.roleName ??
  //     userObj?.user?.role ??
  //     // roles array case
  //     (Array.isArray(userObj.roles) && userObj.roles[0]) ??
  //     ''
  //   )
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      console.log("Login result:", result);

      if (!result.success) {
        if (result.code === "EMAIL_NOT_VERIFIED") {
          setError("Email not verified. Please verify your email.");
        } else {
          setError(result.error ?? "Login failed. Please check credentials.");
        }
        return;
      }


      // pull user object if needed
      const userObj = result.user;

      const role = result.user.role;

      // const role = (
      //   userObj?.role ||
      //   userObj?.roleName ||
      //   (Array.isArray(userObj?.roles) && userObj.roles[0]) ||
      //   ""
      // ).toString().toLowerCase();

      //  After successful login
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath, { replace: true });
        return;
      }

      switch (role) {
        case "student":
          navigate("/student", { replace: true });
          break;

        case "trainer":
          navigate("/trainer", { replace: true });
          break;

        case "admin":
          navigate("/admin", { replace: true });
          break;

        default:
          navigate("/main", { replace: true });
      }
    } catch (err: any) {
      console.error("Login error", err);
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setError("");
    setLoading(true);
    try {
      const result = await googleLogin(credentialResponse.credential);

      if (!result.success) {
        if (result.code === "EMAIL_NOT_VERIFIED") {
          setError("Email not verified. Please verify your email.");
          return;
        }

        setError(result.error || "Google Login Failed");
        return;
      }

      const userObj = result.user;
      const role = userObj?.role;

      if (role === "student") navigate("/student", { replace: true });
      else if (role === "trainer") navigate("/trainer", { replace: true });
      else if (role === "admin") navigate("/admin", { replace: true });
    } catch (err: any) {
      console.error("Google Login Failed", err);
      setError(err?.response?.data?.message || "Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookClick = async () => {
    setError('');
    console.log("before try in login.tsx")
    try {
      const fbResponse: any = await loginWithFacebook();
      setLoading(true);
      const result = await facebookLogin(fbResponse.accessToken, fbResponse.userID);
      console.log("Inside try in login.tsx", result)

      if (!result.success) {
        setError(result.error ?? 'Facebook Login Failed');
        return;
      }
      console.log("inside try After result check in login.tsx")
      const role = result.user.role;

      console.log("navigate to role", role);
      if (role === 'student') navigate('/student', { replace: true });
      else if (role === 'trainer') navigate('/trainer', { replace: true });
      else if (role === 'admin') navigate('/admin', { replace: true });
      else navigate('/main', { replace: true });


    } catch (err: any) {
      console.error("Facebook Error:", err);
      if (typeof err === 'string' && err.includes('cancel')) {
        return;
      }
      setError('We are Still Working, Sit Tight! Try again Later.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-[#5186cd]">
      {/* Home Icon Button */}
      <Link
        to="/"
        className="absolute top-6 right-6 p-2 rounded-lg bg-[#fef5e4] text-[#5186cd] backdrop-blur-md hover:bg-[#205eb0]/30 hover:text-[#fef5e4]  transition flex items-center justify-center"
        aria-label="Go to Home"
      >
        <Home className="h-6 w-6  transition-colors duration-300" />
      </Link>

      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full"
          style={{
            background: "#426fab",
            opacity: 0.44,
            animation: "floaty 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-44 right-16 w-24 h-24 rounded-full"
          style={{
            background: "#426fab",
            opacity: 0.4,
            animation: "floaty 6s ease-in-out infinite",
            animationDelay: "1.8s",
          }}
        />
        <div
          className="absolute bottom-24 left-1/4 w-40 h-40 rounded-full"
          style={{
            background: "#426fab",
            opacity: 0.43,
            animation: "floaty 6s ease-in-out infinite",
            animationDelay: "3.2s",
          }}
        />
        <div
          className="absolute bottom-44 right-44 w-24 h-24 rounded-full"
          style={{
            background: "#426fab",
            opacity: 0.42,
            animation: "floaty 6s ease-in-out infinite",
            animationDelay: "1.8s",
          }}
        />
      </div>

      <div className="max-w-md w-full mx-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[white] mb-2">
            Welcome Back
          </h1>
          <p className="text-[white] text-lg font-extrabold">
            Sign in to Continue your Learning Journey
          </p>
        </div>

        <div className="glass-effect rounded-2xl p-8 shadow-2xl bg-white/80 backdrop-blur">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <div className="flex flex-col gap-2">
                <span>⚠️ {error}</span>

                {error.toLowerCase().includes("verify") && (
                  <button
                    onClick={() => navigate("/verify-email")}
                    className="text-sm font-semibold underline text-blue-700 hover:text-blue-900 text-left"
                  >
                    Verify Email →
                  </button>
                )}
              </div>
            </div>
          )}


          <form onSubmit={handleSubmit} className="space-y-6" aria-live="polite">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-base font-semibold text-[#2D274B] mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9787F3] h-5 w-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-base font-semibold text-[#2D274B] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9787F3] h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9787F3] focus:border-[#9787F3] transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8C83C9] hover:text-[#4B437C] transition-colors duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right mt-2">
              <Link
                to="/forget-password"
                className="text-sm font-semibold hover:underline"
                style={{ color: "#2D274B" }}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit button */}
            {/* bg-[#fef5e4] text-[#5186cd] hover:bg-[#205eb0]/30 hover:text-[#fef5e4]  */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center text-base sm:text-lg py-3 rounded-xl font-semibold bg-[#5186cd] text-[#fef5e4] hover:bg-[#095ac4]  hover:opacity-90 transition"
              aria-disabled={loading}
            >
              {loading ? (
                <div className="loading-dots" aria-hidden>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center">
            <div className="w-full border-t border-gray-300 my-4 position-relative">
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  px-2 text-gray-500 text-sm">
                Or continue with
              </span>
            </div>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError("Google Login Failed")}
              useOneTap={false}
              shape="pill"
              theme="outline"
              width={320}
            />
            {/* facebook login commented out unless our bussiness is live */}
            {/* <button
              type="button"
              onClick={handleFacebookClick}
              disabled={loading}
              className="flex items-center justify-between gap-3 w-full max-w-[320px] mt-2 pl-2 pr-14 py-1 border border-gray-300 rounded-full shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
                alt="Facebook Logo"
                className="w-5 h-5"
              />
              <span>Continue with Facebook</span>
            </button> */}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#2D274B] font-bold">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold hover:underline"
                style={{ color: "#426fab" }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
