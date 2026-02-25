import { Outlet, NavLink } from 'react-router-dom';
import { ClipboardCheck, Ship, User } from 'lucide-react';

const navItems = [
  { to: '/prp/07-test', label: '07 Test', icon: ClipboardCheck },
  { to: '/prp/08-ship', label: '08 Ship', icon: Ship },
] as const;

export function PrpLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-white">
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-semibold text-gray-900">Placement Prep</h1>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" aria-hidden />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
