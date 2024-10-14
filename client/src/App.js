// React Router
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// React Bootstrap Components
import { Container } from 'react-bootstrap';

// Redux
import { Provider } from 'react-redux';
import store from './redux/store';

// Custom Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import PrivateRoute from './utils/PrivateRoute';

// Other
import { Toaster } from 'react-hot-toast';

const App = () => {
    return <Provider store={store}>
        <Router>
            <Navbar />
            <Container>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* Private Route */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/profile-details" element={<Profile />} />
                    </Route>

                    {/* Error Page Route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Container>
            <Toaster />
        </Router>
    </Provider>
};

export default App;
