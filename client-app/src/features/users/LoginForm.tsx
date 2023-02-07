import { Form, Formik } from 'formik';
import React from 'react';
import { Button } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';

const LoginForm = () => {
    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={values => console.log(values)}
        >
            {({ handleSubmit }) => (
                <Form className='ui form'
                    onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />
                    <Button content="Login" type='submit' fluid />
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
