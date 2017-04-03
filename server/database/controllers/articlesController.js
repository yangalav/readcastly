const db = require('../dbConfig');
const Articles = require('../collections/articles');
const Article = require('../models/article');
const ArticlesUsers = require('../collections/articles-users');
const ArticleUser = require('../models/article-user');
const SourceCon = require('./sourcesController')

var exactFind = false;
const exactFindMsg = [{"Has_Already": "This article is already in your library"}];


exports.create = function(articleData,callback) {
  exactFind = false;
  return new Article({url: articleData.url}).fetch()
    .then(function(found) {
      if (found) {
        console.log('FOUND === ', found.attributes.id);
        console.log('USER === ', articleData.user_id);
        return new ArticleUser({article_id: found.attributes.id,user_id: articleData.user_id}).fetch()
          .then(function(alsoFound) {
            return alsoFound ? exactMatch(callback) : linkArticleUser(found,articleData);
          })
          .catch(function(error) {console.log('ERROR DEALING WITH EXISTING ARTICLE', error)})
      } else {
        return SourceCon.getSource(articleData.domain)
          .then(function(sourceId){return makeArticle(sourceId,articleData);})
          .then(function(article){return linkArticleUser(article,articleData);})
          .catch(function(error) {console.log('ERROR DEALING WITH NEW ARTICLE', error)})
      }
    })
    .then(function(entry) {
      return !exactFind ? getAll(entry.attributes.user_id,callback) : console.log('DOWN HERE');
    })
    .catch(function(error) {console.log('ERROR CHECKING URL PASSED IN', error);})
};



var exactMatch = function(callback) {
  exactFind = true;
  return callback(exactFindMsg);
};

var linkArticleUser = function(article,articleData) {
  return ArticlesUsers.create({
    article_id: article.id,
    user_id: articleData.user_id
  })
};

var makeArticle = function(sourceId,articleData) {
  console.log('SOURCE ID === ', sourceId)
  return Articles.create({
    url: articleData.url,
    title: articleData.title,
    author: articleData.author,
    publication_date: articleData.publication_date,
    source_id: sourceId,
    text: articleData.text,
    image: articleData.image,
    excerpt: articleData.excerpt,
    word_count: articleData.word_count,
    est_time: articleData.est_time,
    created_by: articleData.user_id
  })
};

var getAll = function(userId,callback) {
  console.log('IN GET ALL userID = ',userId);
  return db.knex('Articles')
    .join('Articles-Users','Articles.id','Articles-Users.article_id')
    .where('Articles-Users.user_id','=', userId)
    .select('*')
    .then(callback);
};

