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
    return new Promise((resolve, reject) => {
        fetch(`${API_ROOT}/api/v1/histories/${projectID}/forecast?features=${JSON.stringify(features)}`, {
            method: 'GET',
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(body => {
                    // console.log(`body:${JSON.stringify(body, null, 2)}`);
                    // console.log(`distribution:${JSON.stringify(body.distribution, null, 2)}`);
                    resolve(body.distribution);
                });
            } else {
                console.warn(`createProject():${JSON.stringify(resp, null, 2)}`);
                reject(`API endpoint failed: resp: ${JSON.stringify(resp, null, 2)}`);
            }
        }).catch(err => {
            reject(err);
        });
    });
}

export function loadHistory(projectID) {
    return new Promise((resolve, reject) => {
        fetch(`${API_ROOT}/api/v1/histories/${projectID}`, {
            method: 'GET',
        }).then(resp => {
            if (resp.ok) {
                resp.json().then(body => {
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


