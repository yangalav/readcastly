const db = require('../dbConfig');
const Sources = require('../collections/sources');
const Source = require('../models/source');
const SourcesUsers = require('../collections/sources-users');
const SourceUser = require('../collections/source-user');

exports.sourceId;

exports.getSource = function(domain) {
  // Check for existence of source
  new Source({homepage: domain}).fetch()
  // If exists grab ID
  .then(function(found) {
    if (found) {
      sourceId = found.id;
    } else {
      Sources.create({
        name: domain,
        homepage: domain/*,*/
        /*most_read: TBD,*/
        /*image: TBD*/
      })
      .then(function(newSource) {
        sourceId = newSource.id;
      })
      .catch(function(error) {
        console.log('ERROR CREATING SOURCE IN ARTICLE CONTROLLER', error);
      });
    }
  })
  .catch(function(error) {
    console.log('ERROR GETTING EXISTING SOURCE ID IN ARTICLE CONTROLLER', error);
  })
}
