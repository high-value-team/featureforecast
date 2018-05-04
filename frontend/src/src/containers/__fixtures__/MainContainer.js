import React  from 'react';
import MainContainer from '../MainContainer';

export default {
    component: MainContainer,
    reduxState: {
        project: {
            name: "cool title",
            version: "",
        }
    },
    fetch: [
        {
            matcher: '/api/v1/version',
            response: {number: "versionNumber*", timestamp: "2018-04-04T10:32:40+01:00", dbPath: "/mnt"}
        }
    ],
    props: {
        children: (
            <div>
                <p>Fixture ain't afraid of JSX</p>
                <p>Fixture ain't afraid of nothin!</p>
            </div>
        ),
    }
};
