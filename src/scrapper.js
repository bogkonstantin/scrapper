const https = require('https');

class Scrapper {
    setExtractor(func) {
        if (!func) {
            func = () => {
                console.log('Empty extractor');
            }
        }
        this._extractor = func;
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
        this._url = url;
        this._options = options;
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
            const callback = (response) => {
                let data = '';
                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', function () {
                    resolve(data);
                });
            }

            const request = https.request(url, options, callback);
            request.on('error', error => {
                reject(error);
            });
            request.end();
        });
    }
}

module.exports = Scrapper;
