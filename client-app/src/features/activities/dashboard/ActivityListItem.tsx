import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityListItemAttendee from './ActivityListItemAttendee';


interface Props {
    activity: Activity;
}

const ActivityListItem = ({ activity }: Props) => {
    return (
        <Segment.Group key={activity.id}>
            <Segment>
                <Item.Group>
                    <Item.Image size='tiny' circular src='/assets/user.png' />
                    <Item.Content>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>
                            {activity.title}
                        </Item.Header>
                        <Item.Description> Hosted By {activity.host?.displayname} </Item.Description>
                        {activity.isHost}
                        {activity.isHost && (
                            <Item.Description>
                                <Label basic color='orange'>
                                    You are hosting this activity
                                </Label>
                            </Item.Description>
                        )}
                        {activity.isGoing && !activity.isHost && (
                            <Item.Description>
                                <Label basic color='green'>
                                    You are going to this activity
                                </Label>
                            </Item.Description>
                        )}
                    </Item.Content>
                </Item.Group>
            </Segment>
            <Segment>
                <span><Icon name='clock' />{format(activity.date!, 'dd MMM yyyy h:mm aa')}</span>
                <span><Icon name='marker' />{activity.venue}</span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
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
