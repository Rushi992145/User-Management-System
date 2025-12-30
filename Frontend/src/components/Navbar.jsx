import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm flex-shrink-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          {/* Logo */}
          <motion.div
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={isAdmin ? '/admin/dashboard' : '/profile'}
              className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 whitespace-nowrap"
            >
              User Mgmt
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* User Info - Desktop */}
            <motion.div
              className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 leading-tight">
                  {user.name}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </motion.div>

            {/* Mobile User Badge */}
            <div className="md:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Navigation Links */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`hidden lg:block px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive('/admin/dashboard')
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-slate-700 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                Dashboard
              </Link>
            )}

            <Link
              to="/profile"
              className={`hidden lg:block px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive('/profile')
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-slate-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Profile
            </Link>

            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-sm px-4 py-2.5"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
