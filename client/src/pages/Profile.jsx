// React
import { useState, useEffect, useRef } from 'react';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, updateUser } from '../redux/userSlice';

// React Hook Form
import { useForm } from 'react-hook-form';

// React Bootstrap Components
import { Form, Button, Container, Row, Col, Image, Spinner } from 'react-bootstrap';

// API Service
import { updateUserService } from '../service/user.service';

// Utility Functions
import { updateUserSession } from '../utils/session.utils';

// Other
import toast from 'react-hot-toast';

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

    const placeholderImage = 'https://via.placeholder.com/150';

    const [profileImage, setProfileImage] = useState(user?.profileImg || placeholderImage);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const { register, setValue, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
        }
    });

    useEffect(() => {
        if (user) {
            setValue('firstName', user.firstName);
            setValue('lastName', user.lastName);
            setValue('email', user.email);
        }
    }, [user, setValue]);

    /**
        * @function handleImageUpload
        * @param e
        * @description handles the image upload process for the profile picture
    */
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    /**
        * @function handleImageClick
        * @param 
        * @description handles the click event for the profile image to trigger file input
    */
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    /**
        * @function onSubmit
        * @param formData
        * @description handles the submission of the profile update form, sending the user's data to the update service and handling success or error responses.
    */
    const onSubmit = async (formData) => {
        setLoading(true);
        const data = new FormData();
        data.append('userId', user?.id);
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('email', formData.email);

        if (selectedFile) {
            data.append('profileImg', selectedFile);
        }

        try {
            const result = await updateUserService(data);
            updateUserSession(result?.data?.user);
            dispatch(updateUser(result?.data?.user));

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update profile. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={6}>
                    <h2>Profile Manager</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="text-center mb-3">
                            <Image
                                src={profileImage}
                                roundedCircle
                                width={150}
                                height={150}
                                alt="Profile"
                                onClick={handleImageClick}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />

                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter first name"
                                {...register('firstName', { required: 'First name is required' })}
                            />
                            {errors.firstName && <p className="text-danger">{errors.firstName.message}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter last name"
                                {...register('lastName', { required: 'Last name is required' })}
                            />
                            {errors.lastName && <p className="text-danger">{errors.lastName.message}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: emailPattern,
                                        message: 'Invalid email address'
                                    }
                                })}
                            />
                            {errors.email && <p className="text-danger">{errors.email.message}</p>}
                        </Form.Group>

                        <div className="mt-3 mb-3">
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Save Profile'}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
