const db = require('../dbConfig');
const Promise = require('bluebird');
const Articles = require('../collections/articles');
const Article = require('../models/article');
const SourceCon = require('./sourcesController')

var getSource = Promise.promisify(SourceCon.getSource);

exports.create = function(articleData) {
  getSource(articleData.domain)
    .then(function(source) {
      Articles.create({
        url: articleData.url,
        title: articleData.title,
        author: articleData.author,
        publication_date: articleData.publication_date,
        source_id: SourceCon.sourceId,
        text: articleData.text,
        image: articleData.image,
        excerpt: articleData.excerpt,
        word_count: articleData.word_count,
        est_time: articleData.est_time,
        created_by: articleData.created_by
    })
    .then(function(article) {
      //ADD TO JOIN TABLE
  }

}