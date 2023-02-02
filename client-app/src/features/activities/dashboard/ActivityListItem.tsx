import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Item, Button, Label, Segment, Icon } from 'semantic-ui-react';
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
        <Segment.Group key={activity.id}>
            <Segment>
                <Item.Group>
                    <Item.Image size='tiny' circular src='/assets/user.png' />
                    <Item.Content>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>
                            {activity.title}
                        </Item.Header>
                        <Item.Description> Hosted By Franco</Item.Description>
                    </Item.Content>
                </Item.Group>
            </Segment>
            <Segment>
                <span><Icon name='clock' />{activity.date}</span>
                <span><Icon name='marker' />{activity.venue}</span>
            </Segment>
            <Segment secondary>
                Attendees goes here
            </Segment>
            <Segment clearing>
                <span>
                    {activity.description}
                    <Button as={Link} to={`/activities/${activity.id}`}
                        color='teal' floated='right' content='View' />
                </span>
            </Segment>

        </Segment.Group>
    );
};

export default ActivityListItem;
