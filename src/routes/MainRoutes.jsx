import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ProtectedRoute from './protected-routes/ProtectedRoutes';
import { UnCompleteRegRoute, CompletedRegRoute } from './protected-routes/uncompleteRegistrationRoute';
import Customers from 'pages/extra-pages/Customers';
import ProductsList from 'pages/ProductsList/ProductsList';
import AddProducts from 'pages/AddProducts/AddProducts';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
const AuthCreateStore = Loadable(lazy(() => import('pages/authentication/CreateStore')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: (
        <UnCompleteRegRoute>
          <DashboardDefault />
        </UnCompleteRegRoute>
      )
    },

    {
      path: '/create-store',
      element: (
        <CompletedRegRoute>
          <AuthCreateStore />
        </CompletedRegRoute>
      )
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <UnCompleteRegRoute>
              <DashboardDefault />
            </UnCompleteRegRoute>
          )
        }
      ]
    },
    {
      path: 'orders',
      element: (
        <UnCompleteRegRoute>
          <SamplePage />
        </UnCompleteRegRoute>
      )
    },
    {
      path: 'products',
      element: (
        <UnCompleteRegRoute>
          <ProductsList />
        </UnCompleteRegRoute>
      )
    },
    {
      path: 'add-product',
      element: (
        <UnCompleteRegRoute>
          <AddProducts />
        </UnCompleteRegRoute>
      )
    },

    {
      path: 'customers',
      element: (
        <UnCompleteRegRoute>
          <Customers />
        </UnCompleteRegRoute>
      )
    }
  ]
};

export default MainRoutes;
