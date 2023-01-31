import { ChangeEvent, useState } from "react";
import { Button, Form, InputOnChangeData, Segment, TextAreaProps } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/store/store";

interface Props {
    createOrEdit: (activity: Activity) => void;
    submitting: boolean;
}

export default function ActivityForm({ createOrEdit, submitting }: Props) {

    const { activityStore } = useStore();
    const { selectedActivity, closeForm } = activityStore;

    const initialState: Activity = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
    }

    const [activity, setActivity] = useState<Activity>(initialState);

    function handleSubmit() {
        console.log(activity);
        createOrEdit(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, data: InputOnChangeData | TextAreaProps) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input placeholder='Date' type="date" value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />

                <Button floated="right" positive type="submit" content="Submit" loading={submitting} />
                <Button floated="right" type="button" content="Cancel" onClick={closeForm} />
            </Form>

        </Segment>
    );
}