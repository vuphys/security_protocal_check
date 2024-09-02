// script.js
document.getElementById('checkButton').addEventListener('click', checkUrl);
document.getElementById('urlInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkUrl();
    }
});

function checkUrl() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const resultDiv = document.getElementById('result');

    if (!urlInput) {
        resultDiv.innerHTML = 'Please enter a website URL.';
        return;
    }

    // Clean up the URL user input
    const cleanUrlInput = urlInput.replace(/^https?:\/\//, ''); // Removing existing protocol if any
    const httpUrl = 'http://' + cleanUrlInput;
    const httpsUrl = 'https://' + cleanUrlInput;

    // Create promises to check both HTTP and HTTPS
    const checkHttp = fetch(httpUrl, { method: 'HEAD', mode: 'no-cors' })
        .then(() => false) // If fetch resolves, HTTP is available
        .catch(() => true); // If it fails, the website is inaccessible via HTTP

    const checkHttps = fetch(httpsUrl, { method: 'HEAD', mode: 'no-cors' })
        .then(() => true) // If fetch resolves, HTTPS is available
        .catch(() => false); // If it fails, the website is inaccessible via HTTPS

    Promise.all([checkHttp, checkHttps]).then(results => {
        const isHttpSecure = results[1]; // Response from HTTPS
        const isHttpInsecure = results[0]; // Response from HTTP

        const websiteName = cleanUrlInput.split('/')[0]; // Extract the website name

        if (isHttpSecure) {
            resultDiv.innerHTML = `The website <strong>${websiteName}</strong> is using <span class="secure">HTTPS (Secure)</span>.`;
        } else if (isHttpInsecure) {
            resultDiv.innerHTML = `The website <strong>${websiteName}</strong> is using <span class="insecure">HTTP (Not Secure)</span>.`;
        } else {
            resultDiv.innerHTML = `Unable to determine the security status for <strong>${websiteName}</strong>. Please check the URL.`;
        }
    }).catch(error => {
        resultDiv.innerHTML = 'An error occurred: ' + error;
    });
}