import ForecastContainer from "../ForecastContainer";

export default {
    component: ForecastContainer,

    reduxState: {
        project: {
            name: "cool title",
            distribution: [
                {
                    "prognosis": 13,
                    "count": 65,
                    "cummulatedProbability": 0.065
                },
                {
                    "prognosis": 14,
                    "count": 71,
                    "cummulatedProbability": 0.136
                },
                {
                    "prognosis": 15,
                    "count": 104,
                    "cummulatedProbability": 0.24
                },
                {
                    "prognosis": 17,
                    "count": 154,
                    "cummulatedProbability": 0.394
                },
                {
                    "prognosis": 18,
                    "count": 12,
                    "cummulatedProbability": 0.406
                },
                {
                    "prognosis": 0,
                    "count": 0,
                    "cummulatedProbability": 0.406
                },
                {
                    "prognosis": 0,
                    "count": 0,
                    "cummulatedProbability": 0.406
                },
                {
                    "prognosis": 22,
                    "count": 9,
                    "cummulatedProbability": 0.415
                },
                {
                    "prognosis": 23,
                    "count": 34,
                    "cummulatedProbability": 0.449
                },
                {
                    "prognosis": 24,
                    "count": 96,
                    "cummulatedProbability": 0.545
                },
                {
                    "prognosis": 26,
                    "count": 197,
                    "cummulatedProbability": 0.742
                },
                {
                    "prognosis": 27,
                    "count": 52,
                    "cummulatedProbability": 0.794
                },
                {
                    "prognosis": 28,
                    "count": 9,
                    "cummulatedProbability": 0.803
                },
                {
                    "prognosis": 0,
                    "count": 0,
                    "cummulatedProbability": 0.803
                },
                {
                    "prognosis": 0,
                    "count": 0,
                    "cummulatedProbability": 0.803
                },
                {
                    "prognosis": 32,
                    "count": 1,
                    "cummulatedProbability": 0.804
                },
                {
                    "prognosis": 34,
                    "count": 70,
                    "cummulatedProbability": 0.874
                },
                {
                    "prognosis": 35,
                    "count": 48,
                    "cummulatedProbability": 0.922
                },
                {
                    "prognosis": 36,
                    "count": 50,
                    "cummulatedProbability": 0.972
                },
                {
                    "prognosis": 38,
                    "count": 28,
                    "cummulatedProbability": 1
                },
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
        calculateForecast: (...args) => {
            let str = JSON.stringify(args, null, 2);
            console.log(`calculateForecast() called!\n${str}`);
        },
    },
};
