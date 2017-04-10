require('dotenv').config();
const User = require('./database/models/user');

const errors = {
    hasAlready: {"error": "This article is already in your database"},
    badUrl: {"error": "Sincere apologies from the Read.cast.ly team, but the URL submitted is one of a small number that our service cannot currently handle (such as URLs from LinkedIn Pulse). We will work on this!"}, // this is Mercury parser issue where it won't accept certain URLs
    mercuryCantParse: {"error": "The URL submitted is malformed. Please check that it does not have any extra characters on the front or back (e.g., a quotation mark) and resubmit the URL."}
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

module.exports = {
  errors: errors,
  domainExtractor: domainExtractor
};
