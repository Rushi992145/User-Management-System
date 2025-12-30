import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { checkAuth } from '../redux/slices/authSlice';

// Component to check auth on mount
const AuthChecker = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return children;
};

export const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthChecker>{children}</AuthChecker>
    </Provider>
  );
};

