import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/store/store';

const LoginForm = () => {

    const { userStore } = useStore();
    const { login } = userStore;

    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={async (values, { setErrors }) =>
                login(values).catch((e) => setErrors({ error: "Invalid email or password" }))

            }
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form'
                    onSubmit={handleSubmit} autoComplete='off'>
                    <Header as="h2" content="Login to reactivities" color='teal' textAlign='center' />
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <Label style={{ marginBottom: 10 }}
                                basic
                                color='red'
                                content={errors.error} />
                        }
                    />
                    <Button loading={isSubmitting} content="Login" type='submit' fluid positive />
                </Form>
            )}
        </Formik>
    );
};

export default observer(LoginForm);
