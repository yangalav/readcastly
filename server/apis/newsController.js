require('dotenv').config();
const newsApiSources = require('../database/collections/newsApi.json');
const Sources = require('../database/collections/sources');
const Source = require('../database/models/source');

const newsApiImport = function(sources) {
  newsApiSources.sources.forEach(function(source){
    Sources.create({
      name: source.name, // is this meant to be sources[0].name...url...id, etc.? Is that sample data from NewsAPI? (As of 4/11 no more source logos)
      homepage: source.url,
      most_read: source.id,
      image: urlsToLogos.medium
    })
    .then(function(source){console.log(source.id, source.name, "created");})
    .catch(function(error){console.log('ERROR ADDING NEWSAPI SOURCE LIBRARY', error);});
  });
  console.log('NEWS API SOURCE LIBRARY SUCCESSSFULLY IMPORTED');
};

const newsApiBuilder = function(sourceId,callback) {
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
              source: 'abc-news-au', // hardcode this for test
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
