require('dotenv').config();
const newsApiSources = require('./database/collections/newsApi.json');
const Sources = require('./database/collections/sources');
const Source = require('./database/models/source');

const objBuilder = function(obj,source) {
//   console.log('source.content = ', source.content);
  // const stripper = function(html) {
  //   var tmp = '';
  //   tmp.innerHTML = html;
  //   return tmp.textContent || tmp.innerText;
  // };
  // var excerpt = stripper(source.content);
  // console.log('server.js, objBuilder, l 112. testing stripper func. excerpt = ', excerpt);

  obj.title = source.title;
  obj.text = source.content;
  obj.author = source.author || "Information not available";
  obj.publication_date = source.date_published;
  obj.image = source.lead_image_url || "https://ca.slack-edge.com/T2SUXDE72-U2T9QJWCE-ea64dc6deeb5-72";
  obj.excerpt = source.excerpt;
  obj.word_count = source.word_count;
  obj.est_time = source.word_count / 145;
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



module.exports = {
  objBuilder : objBuilder,
  domainExtractor: domainExtractor,
  newsApiImport : newsApiImport,
  newsApiBuilder: newsApiBuilder;
};