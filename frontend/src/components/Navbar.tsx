import { useState } from "react";
import logo from "../assets/newlogo.png";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CurrencySelector from "../components/CurrencySelector";

type NavbarProps = {
  variant?: "default" | "main";
};

const Navbar = ({ variant = "default" }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const location = useLocation();

  const dashboardLink = user
    ? user.role === "trainer"
      ? "/trainer"
      : user.role === "admin"
        ? "/admin"
        : "/student"
    : "/login";

  if (loading) return null;

  const isAuthResolved = !loading;

  const handleScroll = (id: string) => {
    // Check if we are currently on the about page
    if (location.pathname === "/about") {
      const element = document.getElementById(id);
      if (element) {
        // Slight delay or immediate scroll
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="flex w-full h-[75px] md:h-[85px] bg-white">

        {/* LEFT */}
        <div className="w-fit flex items-center pl-2 md:pl-10">
          <Link to="/" className="h-full flex items-center">
            <img
              src={logo}
              alt="LearnILM World"
              className="h-full w-auto object-contain"
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex items-center justify-end pr-4 md:pr-10">

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-8">

            {/* Currency selector ONLY for main variant */}
            {variant === "main" && (
              <CurrencySelector variant="header" />
            )}

            <Link
              to="/about#about"
              onClick={() => handleScroll("about")}
              className="text-lg font-medium text-[#203989] hover:text-black transition no-underline"
            >
              About
            </Link>

            <Link
              to="/careers"
              onClick={() => handleScroll("careers")}
              className="text-lg font-medium text-[#203989] hover:text-black transition no-underline"
            >
              Careers
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="text-lg font-medium text-[#203989] hover:text-black transition"
                >
                  Log Out
                </button>

                <Link
                  to={dashboardLink}
                  className="px-6 py-2 rounded-full bg-[#024AAC] text-white text-sm font-bold shadow hover:scale-105 transition"
                >
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-lg font-medium text-[#203989] hover:text-black transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full bg-[#024AAC] text-white text-base font-bold shadow hover:scale-105 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* MOBILE MENU */}
          <div className="lg:hidden ml-auto flex items-center">
            <Button
              variant="link"
              className="text-[#203989] text-4xl p-0 no-underline"
              onClick={() => setShowOffcanvas(true)}
            >
              ☰
            </Button>

            <Offcanvas
              show={showOffcanvas}
              onHide={() => setShowOffcanvas(false)}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Menu</Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                <Nav className="flex-column gap-4">

                  {/*  Currency selector in mobile (main variant only) */}
                  {variant === "main" && (
                    <CurrencySelector
                      variant="header"
                      onSelect={() => setShowOffcanvas(false)}
                    />
                  )}

                  <Nav.Link
                    as={Link}
                    to="/about#about"
                    onClick={() => {
                      handleScroll("about");
                      setShowOffcanvas(false);
                    }}
                  >
                    About
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/careers"
                    onClick={() => {
                      handleScroll("careers");
                      setShowOffcanvas(false);
                    }}
                  >
                    Careers
                  </Nav.Link>

                  {user ? (
                    <>
                      <Nav.Link
                        as={Link}
                        to={dashboardLink}
                        onClick={() => setShowOffcanvas(false)}
                      >
                        Dashboard
                      </Nav.Link>

                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                          setShowOffcanvas(false);
                        }}
                        className="w-full mt-2 px-4 py-2 rounded-full bg-[#276dc9] text-white font-bold"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/login"
                        onClick={() => setShowOffcanvas(false)}
                      >
                        Sign In
                      </Nav.Link>

                      <Link
                        to="/register"
                        onClick={() => setShowOffcanvas(false)}
                        className="w-full mt-2 block text-center px-4 py-2 rounded-full bg-[#276dc9] text-white font-bold no-underline"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Offcanvas>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
