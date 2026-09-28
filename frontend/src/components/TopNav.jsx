import { Link, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";

export const TopNav = () => {
  const { pathname } = useLocation();
  const links = [
    { to: "/", label: "Profile" },
    { to: "/facilities", label: "Facilities" },
    { to: "/processes", label: "Processes" },
    { to: "/periods", label: "Periods" },
    { to: "/approvals", label: "Approvals" },
    { to: "/users", label: "Users" },
    { to: "/localisation", label: "Locale" },
  ];
  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white">
            <Leaf className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-sm text-slate-900 dark:text-slate-100">
              Carbon Passport
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Organisation Registry
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              data-testid={`nav-${l.label.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
