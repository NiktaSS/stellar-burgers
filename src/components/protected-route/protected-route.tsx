import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { isAuthorizedSelector } from '@slices';
import React from 'react';

type ProtectedRouteProps = {
  forAuthorized: boolean;
  children?: React.ReactNode;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  forAuthorized = false,
  children
}) => {
  const location = useLocation();
  const isAuthorized = useSelector(isAuthorizedSelector);
  const redirectPath = location.state?.from || '/';

  const shouldRedirect =
    (!forAuthorized && isAuthorized) || (forAuthorized && !isAuthorized);

  const getRedirectDetails = () => {
    if (forAuthorized && !isAuthorized) {
      return {
        path: '/login',
        state: { from: location }
      };
    }
    return {
      path: redirectPath,
      state: null
    };
  };

  if (shouldRedirect) {
    const { path, state } = getRedirectDetails();
    return <Navigate to={path} state={state} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

ProtectedRoute.displayName = 'ProtectedRoute';
