import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/store/store';
import * as Yup from 'yup';

const RegisterForm = () => {

    const { userStore: { register } } = useStore();

    return (
        <Formik
            initialValues={{ dislayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={async (values, { setErrors }) =>
                register(values).catch((e) => setErrors({ error: "Invalid email or password" }))
            }

            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),

            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form'
                    onSubmit={handleSubmit} autoComplete='off'>
                    <Header as="h2" content="Register to reactivities" color='teal' textAlign='center' />

                    <MyTextInput placeholder='Display Name' name='displayName' />
                    <MyTextInput placeholder='User name' name='username' />
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
                    <Button
                        disabled={!dirty || !isValid || isSubmitting}
                        loading={isSubmitting} content="Register" type='submit' fluid positive />
                </Form>
            )}
        </Formik>
    );
};

export default observer(RegisterForm);
