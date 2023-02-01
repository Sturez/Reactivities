import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, InputOnChangeData, Segment, TextAreaProps } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/store/store";
import { v4 as uuid } from "uuid";

export default observer(function ActivityForm() {

    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading,
        loadingInitial, loadActivity } = activityStore;
    const { id } = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });


    useEffect(() => {
        if (id) {
            loadActivity(id).then(activity => setActivity(activity!));
        }

    }, [id, loadActivity]);


    function handleSubmit() {
        console.log(activity);
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(a => {
                navigate(`/activities/${activity.id}`);
            });
        }
        else {
            updateActivity(activity).then(a => {
                navigate(`/activities/${activity.id}`);
            });
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, data: InputOnChangeData | TextAreaProps) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    if (loadingInitial) {
        return (<LoadingComponent content="Loading activity...." />);
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

                <Button floated="right" positive type="submit" content="Submit" loading={loading} />
                <Button floated="right" type="button" content="Cancel" />
            </Form>

        </Segment>
    );
})