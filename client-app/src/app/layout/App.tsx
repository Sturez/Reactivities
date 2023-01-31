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

  async function handleCreateOrEditActivity(activity: Activity) {

    /* this does the same, but everything is compressed to one line.... beautiful, but it can mess up in greater contexts
     
    activity.id
       ? setActivities([...activities.filter(a => a.id !== activity.id), activity])
     : setActivities([...activities, {...activity,id:uuid()}]);
    */
    setSubmitting(true);

    if (activity.id) {
      await agent.Activities.update(activity);
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    } else {
      activity.id = uuid();
      await agent.Activities.create(activity);
      setActivities([...activities, activity]);
    }

    activityStore.closeForm();
    activityStore.selectActivity(activity.id);
    setSubmitting(false);
  }

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
          createOrEdit={handleCreateOrEditActivity}
          activities={activityStore.activities}
          submitting={submitting} />
      </Container>
    </Fragment>
  );
}

export default observer(App);
