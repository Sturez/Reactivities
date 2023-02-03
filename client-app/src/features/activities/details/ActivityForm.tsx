import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { useStore } from "../../../app/store/store";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelect";
import { categoryOptions } from "../../../app/common/form/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";


export default observer(function ActivityForm() {

    const { activityStore } = useStore();
    const { loading, loadingInitial, loadActivity } = activityStore;
    const { id } = useParams();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required('The activity category is required'),
        date: Yup.string().required('The activity date is required'),
        city: Yup.string().required('The activity city is required'),
        venue: Yup.string().required('The activity venue is required'),
    });


    useEffect(() => {
        if (id) {
            loadActivity(id).then(activity => setActivity(activity!));
        }

    }, [id, loadActivity]);


    // function handleSubmit() {
    //     console.log(activity);
    //     if (!activity.id) {
    //         activity.id = uuid();
    //         createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    //     }
    //     else {
    //         updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    //     }
    // }

    // function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, data: InputOnChangeData | TextAreaProps) {
    //     const { name, value } = event.target;
    //     setActivity({ ...activity, [name]: value });
    // }

    if (loadingInitial) {
        return (<LoadingComponent content="Loading activity...." />);
    }

    return (
        <Segment clearing>
            <Formik enableReinitialize
                initialValues={activity}
                onSubmit={values => console.log(values)}
                validationSchema={validationSchema} >

                {({ handleSubmit }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name="title" placeholder="Title" />
                        <MyTextArea rows={3} placeholder='Description' name='description' />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput
                            placeholderText='Date' 
                            name='date'
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />

                        <Button floated="right" positive type="submit" content="Submit" loading={loading} />
                        <Button as={Link} to="/activities" floated="right" type="button" content="Cancel" />
                    </Form>

                )}
            </Formik>
        </Segment>
    );
})