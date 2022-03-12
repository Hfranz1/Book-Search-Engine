import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignUpForm = () => {

    const [userFormData, setUserFormData] = useState({
        username: '',
        email: '',
        password: ''
    });


    const [validated] = useState(false);

    const [showAlert, setShowAlert] = useState(false);


    const [addUser, { error, data }] = useMutation(ADD_USER);

    useEffect(() => {
        if (error) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
    }, [error]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setUserFormData({
            ...userFormData,
            [name]: value
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();


        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await addUser({
                variables: { ...userFormData },
            });

            Auth.login(data.addUser.token);
        } catch (err) {
            console.error(err);
        }

        setUserFormData({
            username: '',
            email: '',
            password: '',
        });
    };

    return (
        <>

            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>

                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Something went wrong with your signup
                </Alert>

                <Form.Group>
                    <Form.Lable htmlFor='username'>Username</Form.Lable>
                    <Form.Control
                        type='text'
                        placeholder='Your username'
                        name='username'
                        onChange={handleInputChange}
                        value={userFormData.username}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Username required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Lable htmlFor='email'>Email</Form.Lable>
                    <Form.Control
                        type='email'
                        placeholder='Your email here'
                        name='email'
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Password required</Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                    <Form.Lable htmlFor='password'>Password</Form.Lable>
                    <Form.Control
                        type='password'
                        placeholder='Your password'
                        name='password'
                        onChange={handleInputChange}
                        value={userFormData.password}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Password required</Form.Control.Feedback>
                </Form.Group>
                <Button
                    disabled={!(userFormData.username && userFormData.email && userFormData.password)}
                    type='submit'
                    variant='sucess'>
                    Submit
                </Button>
            </Form>
        </>
    );
};

export default SignUpForm;