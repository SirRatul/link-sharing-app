// React
import { useState } from 'react';

// React Bootstrap Components
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

// React Hook Form
import { useForm } from 'react-hook-form';

// Redux
import { useDispatch } from 'react-redux';
import { login, updateLinks } from '../redux/userSlice';

// Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// Utility Functions
import { loginService } from '../service/auth.service';
import { setUserSession } from '../utils/session.utils';

// Other
import classNames from 'classnames';
import toast from 'react-hot-toast';

const LoginModal = ({ show, onHide, toggleSignup }) => {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        mode: 'all'
    });

    /**
        * @function togglePasswordVisibility
        * @param 
        * @description toggles the visibility of the password input field
    */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    /**
        * @function onSubmit
        * @param formdata
        * @description handles the submission of the login form, sending the user's email and password to the login service and managing success or error responses.
    */
    const onSubmit = async (formdata) => {
        setLoading(true);
        try {
            const result = await loginService({
                email: formdata.email,
                password: formdata.password
            });
            setUserSession(result?.data?.user?.token, result?.data?.user);
            dispatch(login(result?.data?.user));

            if (result?.data?.user?.links) {
                dispatch(updateLinks(result?.data?.user?.links?.map(item => ({
                    platform: {
                        value: item?.platform,
                        label: item?.platform,
                    },
                    link: item?.link
                }))));
            }

            reset();
            toast.success('Login successful!');
            onHide();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Something went wrong';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return <Modal show={show} onHide={() => {
        reset();
        onHide();
    }} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Please enter a valid email address.'
                            }
                        })}
                        isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <div className={classNames("input-group border rounded", {
                        "border-danger": errors.password
                    })}>
                        <Form.Control
                            className={classNames("border-0", {
                                "is-invalid": errors.password
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            {...register('password', {
                                required: 'Password is required'
                            })}
                        />
                        <div className="d-flex align-items-center input-group-append px-2">
                            {showPassword ? (
                                <FaEyeSlash className='text-secondary' role='button' onClick={togglePasswordVisibility} />
                            ) : (
                                <FaEye className='text-secondary' role='button' onClick={togglePasswordVisibility} />
                            )}
                        </div>
                    </div>
                    <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.password?.message}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Login Button */}
                <div className="d-flex justify-content-center">
                    <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Login'}
                    </Button>
                </div>
            </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center mt-2">
            <p className="mb-0">
                Don't have an account?
                <span className='text-primary ms-2' role="button" onClick={toggleSignup}>Sign up here</span>
            </p>
        </Modal.Footer>
    </Modal>
};

export default LoginModal;
