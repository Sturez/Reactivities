import React, { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from '../../../app/store/store';

interface Props {
    activities: Activity[];
    deleteActivity: (id: string) => void;
    submitting: boolean;
}
export default function ActivityList({ activities, deleteActivity, submitting }: Props) {
    const [target, setTarget] = useState<string>('');
    const { activityStore } = useStore();

    function handleActivityDelete(evt: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(evt.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
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
                                    loading={submitting && target === activity.id}
                                    onClick={(evt) => handleActivityDelete(evt, activity.id)} />

                                <Label content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    );
}