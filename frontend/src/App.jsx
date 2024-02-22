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
import CreateEvent from './components/Events/CreateEvents/CreateEvents';
import MainPage from './components/MainPage/MainPage';


function Layout() {
  //  const sessionUser = useSelector((state) => state.session.user);
  /*
      useEffect(() => {
        if (!sessionUser) {
          navigate('/)
        }
      })
  */

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
        element: <MainPage />
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
         // Needs session user checked
      },
      {
        path: '/groups/:groupid',
        element: <OneGroup />
      },
      {
        path: '/groups/:groupid/edit',
        element: <UpdateGroup />
        // Needs session user checked
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
        path: 'groups/:groupid/event/new',
        element: <CreateEvent />
         // Needs session user checked
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
