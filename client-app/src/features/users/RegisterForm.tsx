import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Header } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/store/store';
import * as Yup from 'yup';
import ValidationError from '../errors/ValidationError';

const RegisterForm = () => {

    const { userStore: { register } } = useStore();

    return (
        <Formik
            initialValues={{ dislayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={async (values, { setErrors }) =>
                register(values).catch((error) => setErrors({ error }))
            }

            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required(),

            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error'
                    onSubmit={handleSubmit} autoComplete='off'>
                    <Header as="h2" content="Register to reactivities" color='teal' textAlign='center' />

                    <MyTextInput placeholder='Display Name' name='displayName' />
                    <MyTextInput placeholder='User name' name='username' />
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <ValidationError errors={errors.error} />
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
