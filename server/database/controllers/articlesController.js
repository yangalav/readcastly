const db = require('../dbConfig');
const Articles = require('../collections/articles');
const Article = require('../models/article');
const ArticlesUsers = require('../collections/articles-users');
const ArticleUser = require('../models/article-user');
const SourceCon = require('./sourcesController');
const User = require('../models/user');
const utils = require('../../utils');

var exactFind = false;
let articleToSend = {};

const create = function(articleData,callback) {
  exactFind = false;
  return new Article({url: articleData.url}).fetch()
    .then(function(found) {
      if (found) {
        console.log('FOUND ==== ', found.id);
        return new ArticleUser({article_id: found.attributes.id,user_id: articleData.user_id}).fetch()
          .then(function(alsoFound) {
            return alsoFound ? exactMatch(callback) : linkArticleUser(found,articleData);
          })
          .catch(function(error) {console.log('ERROR DEALING WITH EXISTING ARTICLE', error);});
      } else {
        return SourceCon.getSource(articleData.domain)
        .then(function(source){return makeArticle(source,articleData);})
        .then(function(article){return linkArticleUser(article,articleData);})
        .catch(function(error) {console.log('ERROR DEALING WITH NEW ARTICLE', error);});
      }
    })
    .then(function(entry) {
      return !exactFind ? callback(articleToSend) : console.log('ARTICLE ALREADY THERE');
    })
    .catch(function(error) {console.log('ERROR CHECKING URL PASSED IN', error);});
};


const deleteOne = function(url, callback) {
  return db.knex('Articles-Users')
    .join('Articles','Articles-Users.article_id','Articles.id')
    .where('Articles.url',url)
    .andWhere('Articles-Users.user_id',User.currentUser)
    .select('Articles-Users.id')
    .then(function(result){
      return db.knex('Articles-Users')
      .where('id',result[0].id)
      .del()
      .then(callback);
    });
};


const exactMatch = function(callback) {
  exactFind = true;
  return callback(utils.errors.hasAlready);
};

const linkArticleUser = function(article,articleData,forExport) {
  articleToSend = article.attributes;
  return ArticlesUsers.create({
    article_id: article.id,
    user_id: articleData.user_id
  });
};

const makeArticle = function(source,articleData) {
  console.log('SOURCE ID === ', source);
  return Articles.create({
    url: articleData.url,
    title: articleData.title,
    author: articleData.author,
    publication_date: articleData.publication_date,
    source_id: source.id,
    source_name: source.name,
    text: articleData.text,
    image: articleData.image,
    excerpt: articleData.excerpt,
    word_count: articleData.word_count,
    est_time: articleData.est_time,
    created_by: articleData.user_id
  });
};

// revert back to var getAll after test
const getAll = function(userId,callback) {
  console.log('IN GET ALL userID = ',userId);
  return db.knex('Articles')
    .join('Articles-Users','Articles.id','Articles-Users.article_id')
    .where('Articles-Users.user_id','=', userId)
    .select('*')
    .then(callback);
};

module.exports= {
  create : create,
  getAll : getAll,
  deleteOne : deleteOne
};
