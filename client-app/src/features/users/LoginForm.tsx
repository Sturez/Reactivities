import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/store/store';

const LoginForm = () => {

    const { userStore } = useStore();
    const { user, login } = userStore;

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={values => login(values)}
        >
            {({ handleSubmit, isSubmitting }) => (
                <Form className='ui form'
                    onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />
                    <Button loading={isSubmitting} content="Login" type='submit' fluid positive />
                </Form>
            )}
        </Formik>
    );
};

export default observer(LoginForm);
