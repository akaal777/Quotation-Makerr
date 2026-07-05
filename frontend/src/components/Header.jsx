import React from "react";
import { NavLink, Link } from "react-router-dom";
import { Sun, FileText, History } from "lucide-react";
import { VENDOR } from "@/lib/constants";

export const Header = () => {
  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2";
  return (
    <header
      data-testid="app-header"
      className="no-print sticky top-0 z-40 backdrop-blur bg-[#f5f5f0]/85 border-b border-stone-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          data-testid="brand-home-link"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-[#D97706] text-white grid place-items-center shadow-sm">
            <Sun className="w-5 h-5" strokeWidth={2.4} />
          </div>
          <div className="leading-tight">
            <div className="font-heading font-semibold text-stone-900 text-base sm:text-lg">
              {VENDOR.name}
            </div>
            <div className="tag text-[0.62rem] text-stone-500 hidden sm:block">
              Quotation Studio
            </div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            data-testid="nav-new-quote"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-700 hover:bg-stone-200/60"
              }`
            }
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">New Quote</span>
          </NavLink>
          <NavLink
            to="/history"
            data-testid="nav-history"
            className={({ isActive }) =>
              `${linkBase} ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "text-stone-700 hover:bg-stone-200/60"
              }`
            }
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
