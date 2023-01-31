import { Fragment, useEffect } from 'react';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';

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
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App);
