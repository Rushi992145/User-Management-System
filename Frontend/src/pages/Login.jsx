import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { isValidEmail } from '../utils/validation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const Login = () => {
  const { user, isAdmin, login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin/dashboard' : '/profile', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);

    if (result.type === 'auth/login/fulfilled') {
      toast.success('Login successful!');
      const user = result.payload;
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/profile');
        }
      }, 500);
    } else if (result.type === 'auth/login/rejected') {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <motion.div
        className="w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl overflow-hidden h-auto lg:h-[600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Side - Branding */}
            <motion.div
              className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 text-white p-8 lg:p-12"
              variants={itemVariants}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.15),transparent_40%)]" />
              <motion.div
                className="relative z-10 space-y-6 max-w-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  Secure Authentication
                </motion.div>
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Welcome back to your{' '}
                  <span className="text-amber-200">workspace</span>
                </h2>
                <p className="text-base text-white/90 leading-relaxed">
                  Manage users, roles, and access with a polished experience
                  tailored for admins and members.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {['Real-time tokens', 'Role-based control', 'Secure cookies'].map(
                    (feature, idx) => (
                      <motion.div
                        key={feature}
                        className="px-4 py-2 rounded-lg bg-white/15 border border-white/25 backdrop-blur-sm text-sm font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.25)' }}
                      >
                        {feature}
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center overflow-y-auto"
              variants={itemVariants}
            >
              <div className="mb-8">
                <motion.p
                  className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome back
                </motion.p>
                <motion.h1
                  className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Sign in to your account
                </motion.h1>
                <motion.p
                  className="text-slate-600 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Access your dashboard, manage users, and update your profile
                  with ease.
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="name@company.com"
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  required
                />

                <div className="flex justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    loading={isSubmitting || loading}
                    className="w-full mt-6"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </form>

              <motion.div
                className="mt-8 pt-6 border-t border-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-center text-slate-600 text-sm">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
