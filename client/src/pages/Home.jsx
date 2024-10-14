// React-Bootstrap
import { Container, Row, Col } from 'react-bootstrap';

// Custom Components
import DynamicSvg from '../components/DynamicSvg';
import CustomizeLinksPage from '../components/CustomizeLinksPage';

const Home = () => {
    return <Container>
        <Row className="mb-4">
            <Col lg={4}>
                <DynamicSvg />
            </Col>
            <Col lg={8}>
                <CustomizeLinksPage />
            </Col>
        </Row>
    </Container>
};

export default Home;
