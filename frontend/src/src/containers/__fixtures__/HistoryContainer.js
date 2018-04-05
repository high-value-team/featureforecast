import HistoryContainer from "../HistoryContainer";

export default {
    component: HistoryContainer,

    reduxState: {
        project: {
            name: "cool title",
            email: "florian@fnbk.cc",
            features: [
                {
                    "quantity":2,
                    "tags":["a"]
                },
                {
                    "quantity":1,
                    "tags":["b"]
                }
            ],
            historicalData: [
                {
                    "value": 1,
                    "tags": [
                        "a"
                    ]
                },
                {
                    "value": 2,
                    "tags": [
                        "a"
                    ]
                },
                {
                    "value": 2,
                    "tags": [
                        "a",
                        "x"
                    ]
                },
                {
                    "value": 3,
                    "tags": [
                        "a"
                    ]
                },
                {
                    "value": 3,
                    "tags": [
                        "a"
                    ]
                },
                {
                    "value": 4,
                    "tags": [
                        "a"
                    ]
                },
                {
                    "value": 10,
                    "tags": [
                        "b",
                        "x"
                    ]
                },
                {
                    "value": 10,
                    "tags": [
                        "b"
                    ]
                },
                {
                    "value": 20,
                    "tags": [
                        "b"
                    ]
                },
                {
                    "value": 20,
                    "tags": [
                        "b"
                    ]
                },
                {
                    "value": 30,
                    "tags": [
                        "b",
                        "x"
                    ]
                }
            ],
            expirationDate: "2018-02-02T19:06:50.7310000Z",
            tags: [
                "adb",
                "cer"
            ],
        }
    },

    props: {
        router: {
            params: {
                projectID: "my-project-ID"
            },
            location: {
                query: {
                    features: `[
                        { "quantity": 2, "tags": ["a"] },
                        { "quantity": 3, "tags": ["b"] }
                    ]`,
                }
            }
        },
        goBack: () => console.log(`goBack() called!`),
        goBackAndReset: () => console.log(`goBackAndReset() called!`),
        loadHistory: () => console.log(`loadHistory() called!`),
        generateForecastQueryAndRedirect: (...args) => {
            let str = JSON.stringify(args, null, 2);
            console.log(`generateForecastQueryAndRedirect() called!\n${str}`);
        },
    },
};


