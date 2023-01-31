import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from '../../../app/store/store';


export default observer(function ActivityList() {
    const [target, setTarget] = useState<string>('');
    const { activityStore } = useStore();
    const { loading, deleteActivity, activitiesByDate } = activityStore;

    function handleActivityDelete(evt: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(evt.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city},{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button floated="right" content="View" color="blue"
                                    onClick={() => activityStore.selectActivity(activity.id)} />

                                <Button
                                    name={activity.id}
                                    floated="right"
                                    content="Delete"
                                    color="red"
                                    loading={loading && target === activity.id}
                                    onClick={(evt) => handleActivityDelete(evt, activity.id)} />

                                <Label content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
})