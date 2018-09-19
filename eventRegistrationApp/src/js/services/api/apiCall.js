
// This constant is placed on top of the file so that we can easily change 
//      the timeout duration in future (easier code maintainability). 
const timeoutDuration = 5000;

// the apiCall module has one required parameter, route, and two
//     optional paramters, body and method. Both these paramters
//      have default values.
// What this means is that the fetch api accepts two paramters and returns a promise.
// The first parameter is the request URL and the second paramter contains an object
//      with information regarding the request, such as cors, headers, methods, body and so on.

export default function apiCall(route, body = {}, method = 'GET') {


    const request = new Promise((resolve, reject) => {

        // Since we are working with JSON data, we need to create a header with the content type
        //      application/json. We can use the Headers constructor for that purpose.
        const headers = new Headers({
            'Content-Type': 'application/json',
        });

        // using the headres created earlier and the method variable from the parameter
        //      we can create the requestDetails object
        // See that mode: 'cores' underneath method, well that stands for Cross-Origin Resource Sharing(CORS),
        //      which allows servers to do cross-domain data transfers securely.
        const requestDetails = {
            method,
            mode: 'cors',
            headers,
        };
        // This will add the body property for the POST requests. 
        if (method !== 'GET') requestDetails.body = JSON.stringify(body);


        // handleErrors checks whether the response returned by the server is successful.
        // If the response is successful it will decode the response and return it.
        // otherwise, it will throw an error
        function handleErrors(response) {
            if (response.ok) {
                return response.json();
            }
            else {
                throw Error(response.statusText);
            }
        }

        fetch(`${SERVER_URL}/${route}`, requestDetails)
            .then(handleErrors)
            .then(resolve)
            .catch(reject);

    });
    // Fetch has a small problem. It cannot handle timeouts by itself. Imagine the server facing a problem 
    //      and being unable to return a request. In that scenario, the fetch will never resolve. 
    //      To avoid this, we need to do a workaround.
    // timeout is a simple Promise that automatically rejects after a time of 5 seconds (from the timeoutDuration constant).
    const timeout = new Promise((request, reject) => {
        setTimeout(reject, timeoutDuration, `Request timed out!`);
    });

    return new Promise((resolve, reject) => {
        Promise.race([request, timeout])
        .then(resolve)
        .catch(reject);
    });

}