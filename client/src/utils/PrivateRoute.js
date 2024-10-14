import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from "prop-types";

// Redux Functions
import { openLoginModal, selectAuthStatus } from "../redux/userSlice";

// Handle the private routes
const PrivateRoute = (props) => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectAuthStatus);

    if (isAuthenticated) {
        return <Outlet>{props?.children}</Outlet>;
    } else {
        dispatch(openLoginModal()); // Open the login modal
        return <Navigate to="/" />;
    }
};

export default PrivateRoute;

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};
