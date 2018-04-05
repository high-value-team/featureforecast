import React  from 'react';
import {MainContainerUnwrapped} from '../MainContainer';

export default {
    component: MainContainerUnwrapped,
    props: {
        classes: {},
        children: (
            <div>
                <p>Fixture ain't afraid of JSX</p>
                <p>Fixture ain't afraid of nothin!</p>
            </div>
        ),
        version: '{"number": "v1", "timestamp": "2018-04-04T10:32:40+01:00", "dbPath": "/mnt"}',
        name: "my-title",
        loadVersion: () => {
            console.log('loadVersion() called');
        }
    }
};
