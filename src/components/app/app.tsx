import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';
import { useDispatch } from '@store';
import {
  getIngredientsThunk,
  getUserStateSelector,
  getUserThunk
} from '@slices';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';

type RouteConfig = {
  path: string;
  element: JSX.Element;
  protected?: boolean;
  forAuthorized?: boolean;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userLoading = useSelector(getUserStateSelector).isLoading;
  const backgroundLocation = location.state?.background;

  useEffect(() => {
    dispatch(getUserThunk());
    dispatch(getIngredientsThunk());
  }, [dispatch]);

  const mainRoutes: RouteConfig[] = [
    { path: '/', element: <ConstructorPage /> },
    {
      path: '/ingredients/:id',
      element: (
        <div className={`${styles.centeredPage} pt-10`}>
          <h1 className={`${styles.pageTitle} text text_type_main-large mb-5`}>
            Детали ингредиента
          </h1>
          <IngredientDetails />
        </div>
      )
    },
    { path: '/feed', element: <Feed /> },
    {
      path: '/feed/:number',
      element: (
        <div className={`${styles.centeredPage} pt-10`}>
          <h1 className={`${styles.pageTitle} text text_type_main-large mb-5`}>
            #{location.pathname.match(/\d+/)}
          </h1>
          <OrderInfo />
        </div>
      )
    },
    {
      path: '/login',
      element: <Login />,
      protected: true,
      forAuthorized: false
    },
    {
      path: '/register',
      element: <Register />,
      protected: true,
      forAuthorized: false
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
      protected: true,
      forAuthorized: false
    },
    {
      path: '/reset-password',
      element: <ResetPassword />,
      protected: true,
      forAuthorized: false
    },
    {
      path: '/profile',
      element: <Profile />,
      protected: true,
      forAuthorized: true
    },
    {
      path: '/profile/orders',
      element: <ProfileOrders />,
      protected: true,
      forAuthorized: true
    },
    {
      path: '/profile/orders/:number',
      element: (
        <div className={`${styles.centeredPage} pt-10`}>
          <h1 className={`${styles.pageTitle} text text_type_main-large mb-5`}>
            #{location.pathname.match(/\d+/)}
          </h1>
          <OrderInfo />
        </div>
      ),
      protected: true,
      forAuthorized: true
    },
    { path: '*', element: <NotFound404 /> }
  ];

  // Модальные маршруты
  const modalRoutes: RouteConfig[] = [
    {
      path: '/feed/:number',
      element: (
        <Modal
          title={`#${location.pathname.match(/\d+/)}`}
          onClose={() => navigate(-1)}
        >
          <OrderInfo />
        </Modal>
      )
    },
    {
      path: '/ingredients/:id',
      element: (
        <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
          <IngredientDetails />
        </Modal>
      )
    },
    {
      path: '/profile/orders/:number',
      element: (
        <Modal
          title={`#${location.pathname.match(/\d+/)}`}
          onClose={() => navigate('/profile/orders')}
        >
          <OrderInfo />
        </Modal>
      ),
      protected: true,
      forAuthorized: true
    }
  ];

  const renderRoute = (route: RouteConfig) => {
    if (route.protected) {
      if (route.forAuthorized === undefined) {
        throw new Error(
          `forAuthorized must be defined for protected route: ${route.path}`
        );
      }
      return (
        <Route
          key={route.path}
          element={<ProtectedRoute forAuthorized={route.forAuthorized} />}
        >
          <Route path={route.path} element={route.element} />
        </Route>
      );
    }
    return <Route key={route.path} path={route.path} element={route.element} />;
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {userLoading ? (
        <Preloader />
      ) : (
        <>
          <Routes location={backgroundLocation || location}>
            {mainRoutes.map(renderRoute)}
          </Routes>

          {backgroundLocation && (
            <Routes>{modalRoutes.map(renderRoute)}</Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
