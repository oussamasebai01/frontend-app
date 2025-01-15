import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { exact } from 'prop-types';
import PrivateRoute from 'ui-component/privateRoute';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication3/Register3')));
const MailCheck = Loadable(lazy(() => import('views/pages/authentication3/mailCheck')));

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const UserProfile = Loadable(lazy(() => import('views/sample-page/profile')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        exact: true,
        element: <PrivateRoute children={<DashboardDefault />} />
      },
      {
        path: 'dashboard',
        children: [
          {
            path: 'default',
            element: <PrivateRoute children={<DashboardDefault />} />
          }
        ]
      },
      {
        path: 'utils',
        children: [
          {
            path: 'util-typography',
            element: <PrivateRoute children={<UtilsTypography />} />
          }
        ]
      },
      {
        path: 'utils',
        children: [
          {
            path: 'util-color',
            element: <PrivateRoute children={<UtilsColor />} />
          }
        ]
      },
      {
        path: 'utils',
        children: [
          {
            path: 'util-shadow',
            element: <PrivateRoute children={<UtilsShadow />} />
          }
        ]
      },
      {
        path: 'products',
        element: <PrivateRoute children={<SamplePage />} />
      },
      {
        path: 'profile',
        element: <PrivateRoute children={<UserProfile />} />
      }
    ]
  },
  {
    path: '/auth',
    element: <MinimalLayout />,
    children: [
      {
        path: '/auth/login',
        element: <AuthLogin3 />
      },
      {
        path: '/auth/register',
        element: <AuthRegister3 />
      },
      {
        path: '/auth/check',
        element: <MailCheck />
      }
    ]
  }
];

export default MainRoutes;
