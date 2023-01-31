import { Button, ButtonGroup, Card, Image } from "semantic-ui-react";
import { useStore } from "../../../app/store/store";


export default function ActivityDetails() {
    const { activityStore } = useStore();
    const { selectedActivity: activity, openForm, clearSelectedActivity } = activityStore;

    if (!activity) return (<></>);

    return (

        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <ButtonGroup widths={2}>
                    <Button basic color="blue" content="Edit" onClick={() => openForm(activity.id)} />
                    <Button basic color="grey" content="Cancel" onClick={clearSelectedActivity} />
                </ButtonGroup>
            </Card.Content>
        </Card>

    );
}