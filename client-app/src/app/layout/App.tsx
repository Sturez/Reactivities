import { Fragment, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';
import HomePage from '../../features/home/HomePage';

function App() {
  const { activityStore } = useStore();
  const location = useLocation();

  useEffect(() => {
    activityStore.loadingActivities();
  }, [activityStore]);


  if (activityStore.loadingInitial)
    return (<LoadingComponent />)

  return (
    <>
      {
        location.pathname === '/' ? <HomePage /> :
          (
            <>
              <NavBar />
              <Container style={{ marginTop: '7em' }}>
                <Outlet />
              </Container>
            </>
          )
      }
    </>
  );
}

export default observer(App);
