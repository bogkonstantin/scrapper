const assert = require('assert').strict;
const Scrapper = require('../src/scrapper');

describe('Get example.com', async () => {
    let extractorInvoked = false;
    let hasHtml = false;
    let saveCallBackInvoked = false;
    let extractedDataPassedToSave = false;

    const expectedExtracted = 'test data';

    const scrapper = new Scrapper();

    scrapper.setExtractor(
        async response => {
            extractorInvoked = true;
            if (response.includes('<html>')) {
                hasHtml = true;
            }
            return expectedExtracted;
        }
    );

    scrapper.setSaveCallback(extracted => {
        saveCallBackInvoked = true;
        if (expectedExtracted === extracted) {
            extractedDataPassedToSave = true;
        }
    });

    scrapper.setQuery(`https://example.com`);

    it('should run all callbacks and have data', async () => {
        await scrapper.extract();
        assert.ok(extractorInvoked);
        assert.ok(hasHtml);
        assert.ok(saveCallBackInvoked);
        assert.ok(extractedDataPassedToSave);
    });
});
