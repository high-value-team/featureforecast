import CreateHistoryContainer from "../CreateHistoryContainer";

export default {
    component: CreateHistoryContainer,

    reduxState: {},

    props: {
        submitHistory: (obj) => {
            let str = JSON.stringify(obj, null, 2);
            console.log(`submitHistory:\n${str}`);
        }
    },
};
