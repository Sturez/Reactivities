import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Label } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/store/store';


interface Props {
    activity: Activity;
}

const ActivityListItem = ({ activity }: Props) => {
    const [target, setTarget] = useState<string>('');
    const { activityStore } = useStore();
    const { loading, deleteActivity } = activityStore;
    
    function handleActivityDelete(evt: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(evt.currentTarget.name);
        deleteActivity(id);
    }
 
    return (
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
                        as={Link} to={`/activities/${activity.id}`} />

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
    );
};

export default ActivityListItem;
