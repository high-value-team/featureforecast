import {API_ROOT} from "./Config";

//
// api
//

// request: write, data mapping
// response: read, validate, data mapping

export function createHistory(project) {
    const body = JSON.stringify({
        name: project.name,
        email: project.email,
        historicaldata: project.historicaldata,
        historicaldatatoparse: project.historicaldatatoparse,
    });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Content-Length', body.length);

    return new Promise((resolve, reject) => {
        fetch(`${API_ROOT}/api/v1/histories`, {
            method: 'POST',
            headers,
            body,
        }).then(resp => {
            if (resp.ok) {
                resp.text().then(projectID => {
                    resolve(projectID);
                });
            } else {
                console.warn(`createHistory():${JSON.stringify(resp, null, 2)}`);
                reject(`API endpoint failed: resp: ${resp}`);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function calculateForecast(projectID, features) {
    // TODO fix backend API
    const distribution = [
            {
                "prognosis": 13,
                "count": 67,
                "cummulatedProbability": 0.067
            },
            {
                "prognosis": 14,
                "count": 87,
                "cummulatedProbability": 0.154
            },
            {
                "prognosis": 15,
                "count": 114,
                "cummulatedProbability": 0.268
            },
            {
                "prognosis": 17,
                "count": 127,
                "cummulatedProbability": 0.395
            },
            {
                "prognosis": 18,
                "count": 8,
                "cummulatedProbability": 0.403
            },
            {
                "prognosis": 0,
                "count": 0,
                "cummulatedProbability": 0.403
            },
            {
                "prognosis": 0,
                "count": 0,
                "cummulatedProbability": 0.403
            },
            {
                "prognosis": 22,
                "count": 15,
                "cummulatedProbability": 0.418
            },
            {
                "prognosis": 23,
                "count": 39,
                "cummulatedProbability": 0.457
            },
            {
                "prognosis": 24,
                "count": 96,
                "cummulatedProbability": 0.553
            },
            {
                "prognosis": 26,
                "count": 189,
                "cummulatedProbability": 0.742
            },
            {
                "prognosis": 27,
                "count": 42,
                "cummulatedProbability": 0.784
            },
            {
                "prognosis": 28,
                "count": 10,
                "cummulatedProbability": 0.794
            },
            {
                "prognosis": 0,
                "count": 0,
                "cummulatedProbability": 0.794
            },
            {
                "prognosis": 0,
                "count": 0,
                "cummulatedProbability": 0.794
            },
            {
                "prognosis": 32,
                "count": 11,
                "cummulatedProbability": 0.805
            },
            {
                "prognosis": 34,
                "count": 72,
                "cummulatedProbability": 0.877
            },
            {
                "prognosis": 35,
                "count": 57,
                "cummulatedProbability": 0.934
            },
            {
                "prognosis": 36,
                "count": 36,
                "cummulatedProbability": 0.97
            },
            {
                "prognosis": 38,
                "count": 30,
                "cummulatedProbability": 1
            }
        ];

    return new Promise((resolve, reject) => {
        resolve(distribution);
    });

    // const body = JSON.stringify(features);
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // headers.append('Content-Length', body.length);
    //
    // return new Promise((resolve, reject) => {
    //     fetch(`${API_ROOT}/api/v1/histories/${projectID}/forecast`, {
    //         method: 'POST',
    //         headers,
    //         body,
    //     }).then(resp => {
    //         if (resp.ok) {
    //             resp.text().then(body => {
    //                 resolve(body.distribution);
    //             });
    //         } else {
    //             console.warn(`createProject():${JSON.stringify(resp, null, 2)}`);
    //             reject(`API endpoint failed: resp: ${JSON.stringify(resp, null, 2)}`);
    //         }
    //     }).catch(err => {
    //         reject(err);
    //     });
    // });
}

export function loadHistory(projectID) {
    return new Promise((resolve, reject) => {
        fetch(`${API_ROOT}/api/v1/histories/${projectID}`, {
            method: 'GET',
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(body => {
                    console.warn(`loadHistory() success, body:${JSON.stringify(body, null, 2)}`);
                    resolve(body);
                });
            } else {
                console.warn(`loadHistory():${JSON.stringify(resp, null, 2)}`);
                reject(`API endpoint failed: resp: ${JSON.stringify(resp, null, 2)}`);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function getVersion() {
    return new Promise((resolve, reject) => {
        console.log(`API_ROOT:${API_ROOT}`);
        fetch(`${API_ROOT}/api/v1/version`, {
            method: 'GET',
        }).then(resp => {
            if (resp.ok) {
                resp.text().then(version => {
                    console.log(`version:${version}`);
                    resolve(version);
                });
            } else {
                console.warn(`getVersion():${JSON.stringify(resp, null, 2)}`);
                reject(`API endpoint failed: resp: ${JSON.stringify(resp, null, 2)}`);
            }
        }).catch(err => {
            reject(err);
        });
    });
}


