const request = (url, method = 'get', params = null, host = '') => {
    host = host ? host : process.env.REACT_APP_API_URL;

    params = params ? JSON.stringify(params) : null;

    return fetch(`http://${host}${url}`, {
        method: method,
        mode: 'cors',
        body: params,
        headers: new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        }),
    });
}

export default request;