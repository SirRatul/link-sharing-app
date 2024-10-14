// React
import { useState } from 'react';

// React Router
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';

// React Bootstrap Components
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';

// Icons
import { FaLink } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { logout, openLoginModal, closeLoginModal, selectAuthStatus, selectLoginModal } from '../redux/userSlice';

// Utility Functions
import { removeUserSession } from '../utils/session.utils';

// Custom Components
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectAuthStatus);
    const loginModal = useSelector(selectLoginModal);

    const [signupModal, setSignupModal] = useState(false);

    /**
        * @function handleSignupOpen
        * @param 
        * @description opens the signup modal
    */
    const handleSignupOpen = () => {
        dispatch(closeLoginModal());
        setSignupModal(true);
    };

    /**
        * @function handleSignupClose
        * @param 
        * @description closes the signup modal
    */
    const handleSignupClose = () => {
        setSignupModal(false);
    };

    /**
        * @function handleLogout
        * @param 
        * @description logs out the user from the application
    */
    const handleLogout = () => {
        removeUserSession();
        dispatch(logout());
        if (location.pathname !== '/') {
            navigate('/');
        }
        navigate(0);
    };

    return <>
        <BootstrapNavbar bg="light" expand="lg" collapseOnSelect>
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/">Link Sharing App</BootstrapNavbar.Brand>

                <BootstrapNavbar.Toggle aria-controls="navbar-responsive" />

                <BootstrapNavbar.Collapse id="navbar-responsive">
                    <Nav className="mx-auto">
                        <NavLink
                            exact
                            to="/"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            <FaLink className='me-2' />
                            Links
                        </NavLink>
                        <NavLink
                            to="/profile-details"
                            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        >
                            <CgProfile className='me-2' />
                            Profile Details
                        </NavLink>
                    </Nav>

                    <Nav className="ml-auto">
                        {isAuthenticated ? (
                            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                        ) : (
                            <Button variant="outline-primary" onClick={() => dispatch(openLoginModal())}>
                                Login
                            </Button>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>

        <LoginModal
            show={loginModal}
            onHide={() => dispatch(closeLoginModal())}
            toggleSignup={handleSignupOpen}
        />
        <SignupModal
            show={signupModal}
            onHide={handleSignupClose}
            toggleLogin={() => {
                handleSignupClose();
                dispatch(openLoginModal());
            }}
        />
    </>
};

export default Navbar;