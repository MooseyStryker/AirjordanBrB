import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import GetAllGroups from './components/Groups/SeeAllGroups';
import OneGroup from './components/Groups/SingleGroup/SingleGroup';
import CreateGroup from './components/Groups/CreateGroup/CreateGroup';
import UpdateGroup from './components/Groups/UpdateGroup/UpdateGroup';
import AllEvents from './components/Events/GetAllEvents';
import OneEvent from './components/Events/GetSingleEvent/GetSingleEvent';


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: 'login',
        element: <LoginFormPage />
      },
      {
        path: '/groups',
        element: <GetAllGroups />
      },
      {
        path: '/groups/new',
        element: <CreateGroup />
      },
      {
        path: '/groups/:groupid',
        element: <OneGroup />
      },
      {
        path: '/groups/:groupid/edit',
        element: <UpdateGroup />
      },
      {
        path: '/events',
        element: <AllEvents />
      },
      {
        path: '/events/:eventid',
        element: <OneEvent />
      },
      {
        path: '/events/:eventid/new',
        element: <OneEvent />
      },
      {
        path: 'signup',
        element: <SignupFormPage />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
