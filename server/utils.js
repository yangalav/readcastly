require('dotenv').config();
const stripper = require('striptags');
const newsApiSources = require('./database/collections/newsApi.json');
const Sources = require('./database/collections/sources');
const Source = require('./database/models/source');

const errors = {
    hasAlready: {"error": "This article is already in your database"},
    badUrl: {"error": "Sincere apologies from the Read.cast.ly team, but the URL submitted is one of a small number that our service cannot currently handle (such as URLs from LinkedIn Pulse). We will work on this!"}, // this is Mercury parser issue where it won't accept certain URLs
    mercuryCantParse: {"error": "The URL submitted is malformed. Please check that it does not have any extra characters on the front or back (e.g., a quotation mark) and resubmit the URL."}
};

const objBuilder = function(obj,source) {
  obj.title = source.title;
  obj.text = stripper(source.content);
  obj.author = source.author || "Information not available";
  obj.publication_date = source.date_published;
  obj.image = source.lead_image_url || "https://ca.slack-edge.com/T2SUXDE72-U2T9QJWCE-ea64dc6deeb5-72";
  obj.excerpt = source.excerpt;
  obj.word_count = source.word_count;
  obj.est_time = source.word_count / 145; // based on 145 wpm avg. spoken speech
  obj.domain = source.domain || domainExtractor(obj.url);
  return obj;
};

const domainExtractor = function(url) {
  let start,end;
  let i=0;
  let length = url.length;
  while (!start || !end) {
    if(url[i] === '/' && url[i+1] === '/') {
      start = i+2;
      i+=3;
    } else if (url[i] === '/' || i === length) {
      end = i;
    } else {
      i++;
    }
  }
  return url.slice(start,end);
};

const newsApiImport = function(sources) {
  newsApiSources.sources.forEach(function(source){
    Sources.create({
      name: source.name,
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
  new Source({id:sourceId}).fetch()
    .then(function(source) {
      var options = {
            method: 'GET',
            url: 'https://newsapi.org/v1/articles',
            headers: {
              'x-api-key': process.env.NEWSAPI_KEY,
              'content-type': 'application/json'
              },
            qs: {
              source: source.attributes.most_read,
              sortBy: 'top'
              }
            };
      callback(options);
    })
    .catch(function(error){console.log('ERROR BUILDING NEWSAPI REQUEST OBJ ', error);});
};

const mercuryOptions = function(url) {
  return {
    method: 'GET',
    url: 'https://mercury.postlight.com/parser?url=' + url,
    headers: {
      'x-api-key': process.env.PARSER_KEY,
      'content-type': 'application/json'
      }
    };
  };

const readcastBuilder = function(articleData) {
  var readcast = {
    title: articleData.title,
    source: articleData.source
  }
  if (articleData.author) {
    readcast.author = article.author;
  }
  return readcast;
}

module.exports = {
  errors: errors,
  objBuilder : objBuilder,
  domainExtractor: domainExtractor,
  newsApiImport : newsApiImport,
  newsApiBuilder: newsApiBuilder,
  mercuryOptions: mercuryOptions,
  readcastBuilder: readcastBuilder
};
