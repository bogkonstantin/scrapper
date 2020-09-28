const assert = require('assert').strict;
const sinon = require('sinon');
const Scrapper = require('../src/scrapper');

describe('Get example.com', async () => {
    describe('HTTP', async () => {
        it('should run all callbacks and have data', async () => {
            const saveCallback = sinon.fake();
            let extracted;
            const scrapper = new Scrapper();
            scrapper.setExtractor(response => {
                extracted = response.match(/<h1>(.+)<\/h1>/)[1];
                return extracted;
            });
            scrapper.setSaveCallback(saveCallback);
            scrapper.setQuery(`http://example.com`);

            await scrapper.extract();

            assert.strictEqual(extracted, 'Example Domain');
            assert(saveCallback.called);
        });
    });

    describe('HTTPS', async () => {
        it('should run all callbacks and have data', async () => {
            const saveCallback = sinon.fake();
            let extracted;
            const scrapper = new Scrapper();
            scrapper.setExtractor(response => {
                extracted = response.match(/<h1>(.+)<\/h1>/)[1];
                return extracted;
            });
            scrapper.setSaveCallback(saveCallback);
            scrapper.setQuery(`https://example.com`);

            await scrapper.extract();

            assert.strictEqual(extracted, 'Example Domain');
            assert(saveCallback.called);
        });
    });
});

describe('Redirect', async () => {
    it('should return response from redirected page', async () => {
        const saveCallback = sinon.fake();
        let extracted;
        const scrapper = new Scrapper();
        scrapper.setExtractor(response => {
            extracted = response.match(/<title>(.+)<\/title>/)[1];
            return extracted;
        });
        scrapper.setSaveCallback(saveCallback);
        scrapper.setQuery(`https://httpstat.us/301`);

        await scrapper.extract();

        assert.strictEqual(extracted, 'httpstat.us');
        assert(saveCallback.called);
    });

    it('should not be redirected', async () => {
        const saveCallback = sinon.fake();
        let extracted;
        const scrapper = new Scrapper();
        scrapper.setExtractor(response => {
            extracted = response;
            return response;
        });
        scrapper.setSaveCallback(saveCallback);
        scrapper.setQuery(`https://httpstat.us/301`);
        scrapper.setFollowRedirects(false);

        await scrapper.extract();

        assert.strictEqual(extracted, '');
        assert(saveCallback.called);
    });
});
