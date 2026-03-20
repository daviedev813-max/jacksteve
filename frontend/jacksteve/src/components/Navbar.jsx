import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeDropdown = () => {
    const elem = document.activeElement;
    if (elem) elem.blur();
  };

  const handleSignOut = () => {
    onLogout();
    closeDropdown();
    navigate("/");
  };

  const navLinks = (
    <>
      {["Home", "About", "Services", "Contact"].map((item) => (
        <li key={item}>
          <NavLink
            to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
            onClick={closeDropdown}
            className={({ isActive }) =>
              `px-4 py-2 transition-all duration-300 border-b-2 font-black italic uppercase tracking-tight text-[11px]
              ${isActive ? "text-primary border-primary scale-105" : "text-neutral/60 border-transparent hover:text-primary"}`
            }
          >
            {item}
          </NavLink>
        </li>
      ))}

      <div className="hidden lg:block w-px h-6 bg-base-300 mx-2"></div>

      {/* FARMER PORTAL */}
      {(user?.role === "farmer" || user?.role === "admin") && (
        <li>
          <NavLink
            to="/farmer-portal"
            onClick={closeDropdown}
            className="group flex items-center gap-2 bg-secondary/10 hover:bg-secondary text-secondary hover:text-white px-4 py-2 rounded-lg transition-all border border-secondary/20"
          >
            <span className="text-[10px] font-black uppercase italic">
              Farmer.Sys
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary group-hover:bg-white animate-pulse"></span>
          </NavLink>
        </li>
      )}

      {/* MILLER PORTAL */}
      {(user?.role === "miller" || user?.role === "admin") && (
        <li>
          <NavLink
            to="/miller-portal"
            onClick={closeDropdown}
            className="group flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg transition-all border border-primary/20"
          >
            <span className="text-[10px] font-black uppercase italic">
              Miller.Ctrl
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white animate-bounce"></span>
          </NavLink>
        </li>
      )}

      {/* ADMIN FLEET CMD */}
      {user?.role === "admin" && (
        <li>
          <NavLink
            to="/admin/fleet"
            onClick={closeDropdown}
            className="group flex items-center gap-2 bg-neutral/10 hover:bg-neutral text-neutral hover:text-white px-4 py-2 rounded-lg transition-all border border-neutral/20"
          >
            <span className="text-[10px] font-black uppercase italic">
              Fleet.Cmd
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral group-hover:bg-white"></span>
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col bg-base-100 shadow-sm">
      {/* 1. TOP UTILITY BAR (Email + 2 Sliding Numbers + Ticker) */}
      <div
        className={` bg-orange-600 text-white px-2 md:px-8 flex justify-between items-center transition-all duration-500 overflow-hidden ${
          scrolled ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
      >
        {/* Left Side: Contact Info (Now always adjacent) */}
        <div className="flex items-center flex-nowrap gap-3 md:gap-4 text-[8px] sm:text-[10px] font-black uppercase tracking-tighter sm:tracking-widest overflow-x-auto no-scrollbar">
          {/* Email - Always Visible */}
          <a
            href="mailto:info@jacksteve.com"
            className="hover:text-neutral-200 transition shrink-0 flex items-center gap-1"
          >
            <span className="opacity-70 font-normal">@</span> INFO@JACKSTEVE.COM
          </a>

          <span className="opacity-30 shrink-0">|</span>

          {/* TWO NUMBERS ALTERNATING */}
          <div className="h-5 overflow-hidden relative w-40 sm:w-64 shrink-0">
            <div className="animate-phone-slide">
              <a
                href="tel:+254796622480"
                className="h-5 flex items-center hover:text-neutral-200 transition whitespace-nowrap"
              >
                <span className="opacity-70 mr-1">DIR:</span> +254 796 622480
              </a>
              <a
                href="tel:+254725239307"
                className="h-5 flex items-center hover:text-neutral-200 transition whitespace-nowrap"
              >
                <span className="opacity-70 mr-1">FIN:</span> +254 725 239307
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Ticker (Hidden on small screens to prioritize contact info) */}
        <div className="hidden lg:block w-1/2 overflow-hidden relative border-l border-white/20 ml-6">
          <div className="animate-marquee whitespace-nowrap py-1">
            <span className="inline-block font-black uppercase tracking-[0.2em] text-[10px] text-white pr-20">
              ● STATUS: FLEET OPTIMAL ● NETWORK: LIVE TRACKING ●
            </span>
            <span className="inline-block font-black uppercase tracking-[0.2em] text-[10px] text-white pr-20">
              ● STATUS: FLEET OPTIMAL ● NETWORK: LIVE TRACKING ●
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div
        className={`transition-all duration-300 ${scrolled ? "p-0" : "px-3 pt-2 pb-2"}`}
      >
        <nav
          className={`navbar max-w-7xl mx-auto px-5 transition-all duration-300 
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-base-200 py-1"
              : "bg-white/70 backdrop-blur-sm border border-base-200 rounded-2xl py-3"
          }`}
        >
          <div className="navbar-start">
            <Link
              to="/"
              className="flex items-center gap-3 group active:scale-95 transition"
            >
              <img
                src="/jackstevelogo.png"
                alt="logo"
                className={`transition-all ${scrolled ? "h-8" : "h-11"}`}
              />
              <div className="leading-none">
                <span className="text-lg font-black italic uppercase tracking-tight text-neutral leading-none block">
                  JACK<span className="text-primary">STEVE</span>
                </span>
                <span className="text-[8px] tracking-[0.4em] text-secondary font-black uppercase">
                  Logistics
                </span>
              </div>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-1 p-0">{navLinks}</ul>
          </div>

          <div className="navbar-end gap-2">
            {/* MOBILE MENU */}
            <div className="dropdown dropdown-end lg:hidden">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm text-neutral"
              >
                ☰
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-4 p-4 shadow-2xl bg-base-100 border border-base-200 rounded-2xl w-72 font-black uppercase italic animate-in slide-in-from-right duration-300"
              >
                {navLinks}
                <div className="divider my-2"></div>
                {user?.role && user.role !== "guest" ? (
                  <button
                    onClick={handleSignOut}
                    className="btn btn-primary btn-sm text-white w-full"
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="btn btn-primary btn-sm text-white w-full"
                  >
                    Login
                  </Link>
                )}
              </ul>
            </div>

            {/* AUTH SECTION (Enhanced Login Appearance) */}
            {user?.role && user.role !== "guest" ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border-2 border-primary/20 online"
                >
                  <div className="w-9 rounded-full bg-neutral text-neutral-content flex items-center justify-center font-bold">
                    {user.role[0].toUpperCase()}
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="mt-3 p-3 shadow-xl menu dropdown-content bg-base-100 border border-base-300 rounded-xl w-52"
                >
                  <li className="menu-title text-[10px] uppercase opacity-50 px-4 mb-1">
                    {user.name}
                  </li>
                  <li>
                    <Link to="/profile" className="text-xs font-bold py-2">
                      Account Details
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="text-xs font-bold text-error py-2"
                    >
                      Secure Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary group relative hidden sm:flex items-center gap-2 bg-neutral text-white px-5 py-2 rounded-lg font-black uppercase italic text-[11px] overflow-hidden transition-all hover:pr-8 active:scale-95"
              >
                <span className=" relative z-10">Login</span>
                <div className="absolute right-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                  →
                </div>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
