require('dotenv').config();
const request = require('request');
const stripper = require('striptags');
const Articles = require('../database/controllers/articlesController');
const User = require('../database/models/user');
const utils = require('../utils.js');


const articleObjStarter = function(url,userId){
  return {
      url: url,
      user_id: userId
    };
};

const optionsBuilder = function(url) {
  return {
    method: 'GET',
    url: 'https://mercury.postlight.com/parser?url=' + url,
    headers: {
      'x-api-key': process.env.PARSER_KEY,
      'content-type': 'application/json'
      }
    };
};

const articleObjFinisher = function(obj,source) {
  obj.title = utils.unescapeHex(source.title);
  // NOTE: a series of console.log statements that follow (below) track the changes before and after each step in processing the article text
  // console.log('======articleObjFinisher-A -- PRE-STRIP-source.content: ', source.content); /* MH: DEBUGGING */
  // ...put text through the stripper module, to strip away html tags from the article text
  const strippedText = stripper(source.content);
  // console.log('======articleObjFinisher-B -- POST-STRIP-strippedText: ', strippedText); /* MH: DEBUGGING */
  // ...put stripped test through unescapeHex function to remove/replace hex character codes
  const strippedUnescapedText = utils.unescapeHex(strippedText);
  // console.log('======articleObjFinisher-C -- POST-Unescaped-strippedUnescapedText: ', strippedUnescapedText); /* MH: DEBUGGING */
  // ...put strippedUnescapedText through another function to fix spacing issues

  obj.text = utils.postStripSpacing( strippedUnescapedText );
  // console.log('======articleObjFinisher-D -- postStripSpacing: ', obj.text); /* MH: DEBUGGING */

  obj.author = source.author || "Dave Winfield" // "Author not available";
  obj.publication_date = source.date_published;
  obj.image = source.lead_image_url ||   "https://s3.amazonaws.com/readcastly-user-files/readcastly-logo.png";
  obj.excerpt = utils.unescapeHex(source.excerpt);
  obj.word_count = source.word_count;
  obj.est_time = source.word_count / 145; // based on 145 wpm avg. spoken speech
  obj.domain = source.domain || utils.domainExtractor(obj.url);
  return obj;
};

const parseAndSave = function(userId, url, headlineMode, callback){
  let article = articleObjStarter(url,userId);
  request(optionsBuilder(url), function(error, response, body) {
    // error if request doesn't go through
    if(error) {
        console.log('routes.js l 20, GET req to Mercury. error! = ', error);
        callback(utils.errors.mercuryTransmission)
        return;
        // res.status(400).send('Dang; error retrieving parsed text of url from Mercury...');
      }
    try {
        // console.log('routes.js l24, in try block after Mercury response...');
        var parsedBody = JSON.parse(body);
        // console.log('======MERC-CONTROLLER-...result: parsedBody = ', parsedBody); //***
        if(!parsedBody.content) { //  === null
          callback(utils.errors.mercuryCantParse);
          return;
        }
        // error if mercury responds eith error
      } catch (parseError) {
        console.log('routes.js l28, in catch block, try block not able to parse Mercury response. parseError = ', parseError, '\n\n');
        callback(utils.errors.mercuryCantParse);
        return;
      }

    if (parsedBody.error) {
      callback(utils.errors.badUrl);
      return;
    }
    // additional errors...
    if (parsedBody.errorMessage) {
      console.log('Error-Message: ', parsedBody.errorMessage);
      return;

    } else {

      // console.log('=======PARSEDBODY A-PRE=======>>>: ', parsedBody); /* MH: DEBUGGING */
      console.log('=======PARSEDBODY.content A.1 =======typeof >>>: ', typeof parsedBody.content); /* MH: DEBUGGING */

      // ...call utils method to address spacing issues in html, before sending it to stripper module
      parsedBody.content = utils.preStripSpacing(parsedBody.content);
      // console.log('=======PARSEDBODY B-Spaced =======>>>: ', parsedBody); /* MH: DEBUGGING */
      // console.log('=======PARSEDBODY.content B.1 =======typeof >>>: ', typeof parsedBody.content); /* MH: DEBUGGING */

      // ...send article through articleObjFinisher method, above
      article = articleObjFinisher(article, parsedBody);

      // ...send article object on to database/controllers/articlesController.js
      Articles.create(article, headlineMode, function(result){ // ORIGINAL!
        callback(result);
      });
    }
  })
};

module.exports = { parseAndSave : parseAndSave };

