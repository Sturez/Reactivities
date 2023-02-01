import { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

function App() {
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadingActivities();
  }, [activityStore]);


  if (activityStore.loadingInitial)
    return (<LoadingComponent />)

  return (
    <Fragment >
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <Outlet />
      </Container>
    </Fragment>
  );
}

export default observer(App);
