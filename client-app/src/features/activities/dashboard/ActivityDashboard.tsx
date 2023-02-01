import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/store/store';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {

    const { activityStore } = useStore();
    const { loadingActivities, activityRegistry } = activityStore;

    useEffect(() => {
        if (activityRegistry.size <= 1)
            loadingActivities();

    }, [activityRegistry.size, activityStore, loadingActivities]);


    return (
        <Grid>
            <Grid.Column width={'10'}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={'6'}>
                <h2>Activity Filters</h2>
            </Grid.Column>
        </Grid>
    );
})