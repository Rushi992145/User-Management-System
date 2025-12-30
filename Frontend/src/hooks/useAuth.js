import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectUser,
  selectLoading,
  selectIsAuthenticated,
  selectIsAdmin,
  loginUser,
  registerUser,
  logoutUser,
  updateUser,
} from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectLoading);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login: (email, password) => dispatch(loginUser({ email, password })),
    register: (userData) => dispatch(registerUser(userData)),
    logout: () => dispatch(logoutUser()),
    updateUser: (userData) => dispatch(updateUser(userData)),
  };
};

