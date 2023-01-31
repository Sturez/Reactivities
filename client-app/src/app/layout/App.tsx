import { Fragment, useEffect, useState } from 'react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';

function App() {
  const { activityStore } = useStore();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    activityStore.loadingActivities();
  }, [activityStore]);

  async function handleDeleteActivity(id: string) {
    setSubmitting(true);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(a => a.id !== id)]);
    setSubmitting(false);
  }

  if (activityStore.loadingInitial)
    return (<LoadingComponent />)

  return (
    <Fragment >
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          deleteActivity={handleDeleteActivity}
          activities={activityStore.activities}
          submitting={submitting} />
      </Container>
    </Fragment>
  );
}

export default observer(App);
