# Simple web-scrapper

## Installation

```
npm i @bogomolov.tech/scrapper
```

## Usage

```javascript
const Scrapper = require('@bogomolov.tech/scrapper');

const scrapper = new Scrapper();

// http and https are possible
scrapper.setQuery(`https://example.com`);

// or scrapper.setQuery(url, options);
// options are the same as for Node.JS 'https' module 

scrapper.setExtractor(
    response => {
        // extract data here
        // e.g. get header
        const matches = response.match(/<h1>(?<header>.*?)<\/h1>/);
        return matches.groups.header;
    }
);

scrapper.setSaveCallback(extracted => {
    // e.g. save to db or file here
});

// by default it will follow redirects
// disable it with:
// scrapper.setFollowRedirects(false)

await scrapper.extract();

```
