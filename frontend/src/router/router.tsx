import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routes } from './routeConfig';
import ProtectedRoute from './ProtectedRoute';
import Loader from '../components/Loader/Loader';

const Router = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.isProtected ? (
                <ProtectedRoute roles={route.roles}>
                  <route.element />
                </ProtectedRoute>
              ) : (
                <route.element />
              )
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
};

export default Router;