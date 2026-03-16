import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

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
              `px-4 py-2 transition-all duration-300 border-b-2 font-black italic uppercase tracking-tight
               ${isActive ? "text-primary border-primary scale-105" : "text-neutral/60 border-transparent hover:text-primary hover:border-primary/30"}`
            }
          >
            {item}
          </NavLink>
        </li>
      ))}
      
      <div className="hidden lg:block w-px h-6 bg-base-300 mx-2"></div>

        <>
      {/* FARMER PORTAL: Leaf Green */}
      {(user?.role === 'farmer' || user?.role === 'admin') && (
        <li>
          <NavLink to="/farmer-portal" onClick={closeDropdown} 
            className="group flex items-center gap-2 bg-secondary/5 hover:bg-secondary text-secondary hover:text-white px-4 py-2 rounded-lg transition-all border border-secondary/20">
            <span className="font-black italic tracking-tighter uppercase text-[10px]">Farmer.Sys</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary group-hover:bg-white animate-pulse"></span>
          </NavLink>
        </li>
      )}

      {/* MILLER PORTAL: Cabin Orange */}
      {(user?.role === 'miller' || user?.role === 'admin') && (
        <li>
          <NavLink to="/miller-portal" onClick={closeDropdown} 
            className="group flex items-center gap-2 bg-primary/5 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg transition-all border border-primary/20">
            <span className="font-black italic tracking-tighter uppercase text-[10px]">Miller.Ctrl</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary group-hover:bg-white animate-bounce"></span>
          </NavLink>
        </li>
      )}

      {/* ADMIN COMMAND: Tactical Black (Neutral) */}
      {user?.role === 'admin' && (
        <li>
          <NavLink to="/admin/fleet" onClick={closeDropdown} 
            className="group flex items-center gap-2 bg-neutral/5 hover:bg-neutral text-neutral hover:text-white px-4 py-2 rounded-lg transition-all border border-neutral/20 shadow-sm">
            <span className="font-black italic tracking-tighter uppercase text-[10px]">Fleet.Command</span>
            <div className="relative flex items-center justify-center">
               <span className="w-1.5 h-1.5 rounded-full bg-neutral group-hover:bg-white transition-colors"></span>
               <span className="absolute w-3 h-3 rounded-full border border-neutral/30 group-hover:border-white/50 animate-ping"></span>
            </div>
          </NavLink>
        </li>
      )}
    </>

    </>
  );

  return (
    <div className="sticky top-0 z-50 w-full px-4 pt-4">
      {/* 
          CHANGE: Switched from bg-neutral (Black) to bg-white/90.
          Added a bottom border-primary to keep that industrial 'line' feel.
      */}
      <nav className="navbar bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl max-w-7xl mx-auto px-6 border-b-4 border-primary transition-all duration-300">
        
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost text-neutral mr-2">
              <svg xmlns="http://www.w3.org" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-md dropdown-content mt-4 z-[1] p-4 shadow-2xl bg-white border border-base-200 rounded-2xl w-80 font-black uppercase italic">
              {navLinks}
              <div className="divider"></div>
              {user?.role && user.role !== 'guest' ? (
                <li><button onClick={handleSignOut} className="btn btn-primary text-white">Log Out</button></li>
              ) : (
                <li><Link to="/login" className="btn btn-secondary text-white">Partner Access</Link></li>
              )}
            </ul>
          </div>
          
          <Link to="/" className="flex items-center gap-4 group transition-all active:scale-95">
            <img src="/jackstevelogo.png" alt="Logo" className="h-12 w-auto drop-shadow-sm group-hover:scale-105 transition-transform" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black italic tracking-tighter text-neutral uppercase">
                JACK<span className="text-primary">STEVE</span>
              </span>
              <span className="text-[9px] font-black tracking-[0.3em] text-secondary uppercase">Logistics</span>
            </div>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navLinks}
          </ul>
        </div>

        <div className="navbar-end gap-4">
           {/* Telemetry now uses Neutral-focused colors to stay clean */}
           <div className="hidden xl:flex flex-col items-end leading-none mr-2">
              <span className="text-[10px] font-black text-secondary tracking-widest uppercase">Reliable Sourcing</span>
              <div className="flex gap-1 mt-1">
                {[1,2,3].map(i => <div key={i} className="h-1 w-3 bg-primary/20 rounded-full"></div>)}
              </div>
           </div>

          {user?.role && user.role !== 'guest' ? (
             <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-base-300 hover:border-primary transition-colors">
                  <div className="w-10 rounded-full bg-base-200 flex items-center justify-center font-black italic text-primary">
                    {user.role[0].toUpperCase()}
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-4 shadow-2xl menu menu-sm dropdown-content bg-white border border-base-200 rounded-2xl w-52 uppercase italic font-black">
                  <li className="px-4 py-2 text-[9px] opacity-40 border-b mb-2">ID: {user.name || 'System User'}</li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><button onClick={handleSignOut} className="text-error">Log Out</button></li>
                </ul>
             </div>
          ) : (
            <Link to="/login" className="btn btn-primary text-white rounded-xl px-8 shadow-lg shadow-primary/20 border-none font-black italic uppercase tracking-tighter hover:bg-primary/90 transition-all">
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
