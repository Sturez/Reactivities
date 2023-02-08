import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/store/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default observer(function HomePage() {
    const { userStore: { isLoggedIn }, modalStore: { openModal } } = useStore();

    return (
        <Segment inverted textAlign="center" vertical className="masthead" >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                </Header>
                {
                    isLoggedIn ?
                        (
                            <>
                                <Header as='h2' inverted content='Welcome to Reactivities' />
                                <Button as={Link} to='/activities' size="huge" inverted>
                                    Go to Activities
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button size="huge" inverted
                                    onClick={() => openModal(<LoginForm />)}>

                                    Login
                                </Button>
                                <Button size="huge" inverted
                                    onClick={() => openModal(<RegisterForm />)}>
                                    Register
                                </Button>
                            </>
                        )}

            </Container>
        </Segment>
    )
})