import React from 'react';
import { Calendar } from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';

const ActivityFilters = () => {
    return (
        <>
            <Menu size='large' vertical style={{ width: '100%', marginTop: 25 }}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item content='All activities' />
                <Menu.Item content='I am going' />
                <Menu.Item content='I am hosting' />

            </Menu>
            <Header icon='calendar' attached color='teal' content='Date' />
            <Calendar />
        </>
    );
};

export default ActivityFilters;
