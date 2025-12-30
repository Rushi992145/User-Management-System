import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { isValidEmail } from '../utils/validation';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export const UserProfile = () => {
  const { user: authUser, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      const user = response.data.data;
      setProfileData({ name: user.name, email: user.email });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(profileData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;

    setSaving(true);
    try {
      const response = await userAPI.updateProfile(profileData);
      updateUser(response.data.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50/60">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-white to-purple-50/40 flex flex-col overflow-auto">
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
          {/* Header Section */}
          <motion.div
            variants={cardVariants}
            className="bg-white/90 backdrop-blur-lg border border-white/60 shadow-xl rounded-2xl overflow-hidden"
          >
            <div className="px-6 lg:px-8 py-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white/80 uppercase tracking-wide mb-1">
                    Your Profile
                  </p>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Account Settings
                  </h1>
                  <p className="text-sm text-white/90">
                    Update your personal information and manage your credentials
                  </p>
                </div>
                <motion.div
                  className="flex items-center gap-4 px-5 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-xl font-bold">
                    {authUser?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{authUser?.name}</div>
                    <div className="text-xs text-white/80">{authUser?.email}</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Forms Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profile Information Card */}
            <motion.div
              variants={cardVariants}
              className="bg-white/90 backdrop-blur-lg border border-white/60 shadow-xl rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900">
                  Profile Information
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Update your name and email address
                </p>
              </div>
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  error={errors.name}
                  placeholder="Enter your full name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  error={errors.email}
                  placeholder="name@company.com"
                  required
                />

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" loading={saving} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fetchProfile()}
                    disabled={saving}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
