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
  obj.title = source.title;
  obj.text = stripper(source.content);
  obj.author = source.author || "Information not available";
  obj.publication_date = source.date_published;
  obj.image = source.lead_image_url ||   "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT8-E0VKkso9wu60MnVZor7_HqEJIAm8DMB6iJGgFvG1m57WHz0";
  obj.excerpt = source.excerpt;
  obj.word_count = source.word_count;
  obj.est_time = source.word_count / 145; // based on 145 wpm avg. spoken speech
  obj.domain = source.domain || domainExtractor(obj.url);
  return obj;
};

const parseAndSave = function(userId, url,callback){
  let article = articleObjStarter(url,userId);
  request(optionsBuilder(url), function(error, response, body) {
    if(error) {
        console.log('routes.js l 20, GET req to Mercury. error! = ', error);
        res.status(400).send('Dang; error retrieving parsed text of url from Mercury...');
      }
    try {
        console.log('routes.js l24, in try block after Mercury response...');
        var parsedBody = JSON.parse(body);
        // console.log('...result: parsedBody = ', parsedBody);
        if(parsedBody === null) {
          callback(utils.errors.mercuryCantParse);
          return;
        }
      } catch (parseError) {
        console.log('routes.js l28, in catch block, try block not able to parse Mercury response. parseError = ', parseError, '\n\n');
        var parsedBody;
        callback(utils.errors.mercuryCantParse);
        return;
      }
    if (parsedBody.error) {
      callback(utils.errors.badUrl);
    } else {
      article = articleObjFinisher(article,parsedBody);
      Articles.create(article,function(result){
        callback(result);
      });
    }
  })
};




module.exports = { parseAndSave : parseAndSave };
