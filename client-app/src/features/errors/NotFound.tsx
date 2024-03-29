import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

const NofFound = () => {
    return (
        <Segment placeholder>
            <Header icon >
                <Icon name='search' />
                Oops - we've looked everywhere but could not find what you're looking for!
            </Header>
            <Segment.Inline>
                <Button as={Link} to="/activities">Return to activities</Button>
            </Segment.Inline>
        </Segment>
    );
};

export default NofFound;
