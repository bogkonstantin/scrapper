const http = require('http');
const https = require('https');
const URL = require('url').URL;

class Scrapper {
    constructor() {
        this._followRedirects = true;
    }

    setExtractor(func) {
        if (!func) {
            func = () => {
                console.log('Empty extractor');
            }
        }
        this._extractor = func;
    }

    setFollowRedirects(newValue) {
        this._followRedirects = Boolean(newValue);
    }

    setSaveCallback(func) {
        if (!func) {
            func = () => {
                console.log('Empty saveCallback');
            }
        }
        this._saveCallback = func;
    }

    setQuery(url, options = {}) {
        this._url = new URL(url);
        this._options = options;
        if (this._url.protocol === 'https:') {
            this._transport = https;
        } else {
            this._transport = http;
        }
    }

    async extract() {
        this._validateParams();

        const response = await this._request(this._url, this._options);
        const extracted = await this._extractor(response);
        await this._saveCallback(extracted);
        return;
    }

    _validateParams() {
        if (!this._url) {
            throw Error('Url is not specified!');
        }

        if (typeof this._extractor !== "function") {
            throw Error('Extractor  is not a function!');
        }

        if (typeof this._extractor !== "function") {
            throw Error('Save callback is not a function!');
        }
    }

    async _request(url, options) {
        return new Promise((resolve, reject) => {
            let redirectCount = 0;
            const callback = (response) => {
                if (this._followRedirects && response.statusCode >= 300 && response.statusCode < 400) {
                    if (redirectCount > 5) {
                        reject(Error('Too much redirects'));
                        return;
                    }
                    redirectCount++;
                    return sendRequest(response.headers.location, options, callback);
                }

                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', function () {
                    resolve(data);
                });
            }

            const sendRequest = (url, options, callback) => {
                const request = this._transport.request(url, options, callback);
                request.on('error', error => {
                    reject(error);
                });
                request.end();
            }

            sendRequest(url, options, callback);
        });
    }
}

module.exports = Scrapper;
