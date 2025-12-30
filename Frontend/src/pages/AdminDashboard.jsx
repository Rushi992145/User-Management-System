import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../services/api';
import { Button } from '../components/Button';
import { Loading } from '../components/Loading';
import { Modal } from '../components/Modal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    user: null,
  });

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers(page, 10);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = (action, user) => {
    setConfirmModal({ isOpen: true, action, user });
  };

  const confirmAction = async () => {
    const { action, user } = confirmModal;
    setActionLoading(action);

    try {
      if (action === 'activate') {
        await adminAPI.activateUser(user._id);
        toast.success('User activated successfully');
      } else {
        await adminAPI.deactivateUser(user._id);
        toast.success('User deactivated successfully');
      }
      setConfirmModal({ isOpen: false, action: null, user: null });
      fetchUsers(pagination.currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></span>
        Inactive
      </span>
    );
  };

  const getRoleBadge = (role) => {
    return role === 'admin' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
        <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-1.5"></span>
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mr-1.5"></span>
        User
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-lg border border-white/60 shadow-xl rounded-2xl overflow-hidden"
          >
            <div className="px-6 lg:px-8 py-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    User Management
                  </h1>
                  <p className="text-sm text-white/90">
                    Manage all users, roles, and statuses in one centralized
                    dashboard
                  </p>
                </div>
                <motion.div
                  className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-2xl font-bold">{pagination.totalUsers}</span>
                  <span className="text-sm text-white/80">Total Users</span>
                </motion.div>
              </div>
            </div>

            {/* Table Container */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loading size="lg" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500 text-lg">No users found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50/80">
                      <tr>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      <AnimatePresence>
                        {users.map((user, idx) => (
                          <motion.tr
                            key={user._id}
                            className={`transition-colors hover:bg-slate-50/50 ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2, delay: idx * 0.02 }}
                            whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.8)' }}
                          >
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">
                                {user.email}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-700">{user.name}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {getRoleBadge(user.role)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                              {user.status === 'active' ? (
                                <Button
                                  variant="destructive"
                                  onClick={() => handleAction('deactivate', user)}
                                  disabled={actionLoading === 'deactivate'}
                                  loading={actionLoading === 'deactivate'}
                                  className="text-xs px-3 py-1.5"
                                >
                                  Deactivate
                                </Button>
                              ) : (
                                <Button
                                  variant="primary"
                                  onClick={() => handleAction('activate', user)}
                                  disabled={actionLoading === 'activate'}
                                  loading={actionLoading === 'activate'}
                                  className="text-xs px-3 py-1.5"
                                >
                                  Activate
                                </Button>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <motion.div
                    className="px-4 sm:px-6 lg:px-8 py-4 bg-slate-50/60 border-t border-slate-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-slate-700 font-medium">
                        Showing{' '}
                        <span className="font-bold">{pagination.currentPage}</span> of{' '}
                        <span className="font-bold">{pagination.totalPages}</span> pages
                        <span className="mx-2">•</span>
                        <span className="font-bold">{pagination.totalUsers}</span> total
                        users
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => fetchUsers(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrev || loading}
                          className="px-4"
                        >
                          Previous
                        </Button>
                        <div className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700">
                          {pagination.currentPage}
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => fetchUsers(pagination.currentPage + 1)}
                          disabled={!pagination.hasNext || loading}
                          className="px-4"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() =>
          setConfirmModal({ isOpen: false, action: null, user: null })
        }
        title={`Confirm ${confirmModal.action === 'activate' ? 'Activation' : 'Deactivation'}`}
      >
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            Are you sure you want to{' '}
            <strong className="text-slate-900">{confirmModal.action}</strong> the
            user <strong className="text-purple-600">{confirmModal.user?.name}</strong>?
          </p>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <p className="text-sm text-slate-600">{confirmModal.user?.email}</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() =>
                setConfirmModal({ isOpen: false, action: null, user: null })
              }
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmAction}
              loading={!!actionLoading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
