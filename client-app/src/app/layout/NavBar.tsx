import { NavLink } from 'react-router-dom';
import { Button, Container, Menu, Image } from 'semantic-ui-react';

export default function NavBar() {

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header >
                    <Image src='/assets/logo.png' alt='logo' style={{ marginRight: '10px' }} size='mini' />
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name='Activities' />
                <Menu.Item>
                    <Button positive content='Create Activity' as={NavLink} to='/createActivity' />
                </Menu.Item>
            </Container>
        </Menu>
    );
}