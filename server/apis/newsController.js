require('dotenv').config();
const request = require('request');
const newsApiSources = require('../database/collections/newsApi.json');
const Sources = require('../database/collections/sources');
const Source = require('../database/models/source');

const newsApiImport = function(callback) {
  // newsApiSources.sources.forEach(function(source){
  //   Sources.create({
  //     name: source.name, // is this meant to be sources[0].name...url...id, etc.? Is that sample data from NewsAPI? (As of 4/11 no more source logos)
  //     homepage: source.url,
  //     most_read: source.id,
  //     image: urlsToLogos.medium
  //   })
  var storySourceOptions = {
        method: 'GET',
        url: 'https://newsapi.org/v1/sources',
        headers: {
          // 'x-api-key': process.env.NEWSAPI_KEY,
          'content-type': 'application/json'
          },
        qs: {
          // source: source.attributes.most_read,
          // source: 'ars-technica', // hardcode this for test; update with source user selects from list returned from API
          language: 'en'
          }
        };
    request(storySourceOptions, function(error, response, body) {
      console.log('\n\nnewsController GET req to newsApi sources');
      var parsedSourcesObj = JSON.parse(body);
      console.log('\nnewsApi sources = ', parsedSourcesObj.sources);
      callback(parsedSourcesObj.sources);
      })
      // .catch(function(error){console.log('ERROR pulling sources from NEWSAPI:', error);});
    // .then(function(source){console.log(source.id, source.name, "created");})
  console.log('NEWS API SOURCES SUCCESSSFULLY IMPORTED');
 };

const newsApiBuilder = function(source,callback) {
  // new Source({id:sourceId}).fetch() // takes sourceId from client req & queries db; gets source id in newsapi format (e.g., "id": "abc-news-au")
    // .then(function(source) { // creates options obj so routes.js endpoint /topStories can make req to newsapi & res.send back to client; Andrew set up using newsAPI.json data but not tested yet
      var options = {
            method: 'GET',
            url: 'https://newsapi.org/v1/articles',
            headers: {
              'x-api-key': process.env.NEWSAPI_KEY,
              'content-type': 'application/json'
              },
            qs: {
              // source: source.attributes.most_read,
              source: 'ars-technica', // hardcode this for test
              // source: source,
              sortBy: 'top'
              }
            };
      callback(options);
    // })
    // .catch(function(error){console.log('ERROR BUILDING NEWSAPI REQUEST OBJ ', error);});
};

module.exports = {
  newsApiImport : newsApiImport,
  newsApiBuilder: newsApiBuilder,
};
