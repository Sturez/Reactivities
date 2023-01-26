import { Fragment, useEffect, useState } from 'react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split("T")[0];
        activities.push(activity);
      });
      setActivities(activities);
      handleLoading(false);
    })
  }, []);

  function handleSelectedActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectedActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

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

    setEditMode(false);
    setSelectedActivity(activity);
    setSubmitting(false);
  }

  async function handleDeleteActivity(id: string) {
    setSubmitting(true);
    await agent.Activities.delete(id);
    setActivities([...activities.filter(a => a.id !== id)]);
    setSubmitting(false);
  }

  function handleLoading(isLoading: boolean) {
    setLoading(isLoading);
  }

  if (loading)
    return (<LoadingComponent />)

  return (
    <Fragment >
      <NavBar openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectedActivity}
          cancelSelectedActivity={handleCancelSelectActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting} />
      </Container>
    </Fragment>
  );
}

export default App;
