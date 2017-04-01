const db = require('../dbConfig');
const Promise = require('bluebird');
const Articles = require('../collections/articles');
const Article = require('../models/article');
const ArticlesUsers = require('../collections/articles-users');
const ArticleUser = require('../models/article-user');
const SourceCon = require('./sourcesController')

exports.create = function(articleData) {
  new Article({url: articleData.url}).fetch()
    .then(function(found) {
      if (found) {
        new ArticleUser({article_id: found.id,user_id: articleData.user_id}).fetch()
          .then(function(alsoFound) {
            if (alsoFound) {
              console.log("ARTICLE ALREADY IN USER'S LIBRARY - NEED TO FIGURE OUT HOW TO PASS ERROR UP TO FRONT END");
            } else {
              ArticlesUsers.create({
                article_id: found.id,
                user_id: articleData.user_id
              })
              .then(function(articleUserEntry) {
                console.log('EXISTING ARTICLE FOUND, NEW ENTRY CREATED');
              })
              .catch(function(error) {
                console.log('ERROR CREATING NEW ENTRY FOR EXISTING ARTICLE', error);
              })
            }
          })
          .catch(function(error) {
            console.log("ERROR CHECKING IF ARTICLE ALREADY IN USER'S LIBRARY", error)
          })
      } else {
        return SourceCon.getSource(articleData.domain)
          .then(function(sourceId) {
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
            .then(function(article) {
              return ArticlesUsers.create({
                article_id: article.id,
                user_id: article.created_by || 0
              })
              .then(function(entry) {
                console.log('NEW ARTICLE-USER ENTRY CREATED', entry);
                return getAll(entry.attributes.user_id);
              })
              .catch(function(error) {
                console.log('ERROR CREATING ARTICLE-USER ENTRY OF NEW ARTICLE', error);
              })
            })
            .catch(function(error) {
              console.log('ERROR CREATING NEW ARTICLE', error);
            })
          })
          .catch(function(error) {
            console.log('ERROR WITH GETSOURCE FUNCTION', error);
          })
      }
    })
    // .then(function(data) {
    //   console.log('OLD ABOUT TO GET ALL');
    //   // getAll(articleData.user_id);
    // })
    .catch(function(error) {
      console.log('ERROR CHECKING URL PASSED IN', error);
    })
};

var getAll = Promise.promisify(function(userId) {
  console.log('IN GET ALL userID = ',userId);
  // return db.knex.select('*').from('Articles').join('Articles-Users',({'Articles.id' : 'Articles-Users.article_id'}))./*where({'Articles-Users.user_id': userId})*/whereRaw('Articles-Users.user_id = ?', [userId]);
  return db.knex('Articles')
    .join('Articles-Users','Articles.id','Articles-Users.article_id')
    .where('Articles-Users.user_id','=', userId)
    .select('*');
});



