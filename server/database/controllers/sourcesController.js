const db = require('../dbConfig');
const Sources = require('../collections/sources');
const Source = require('../models/source');
const SourcesUsers = require('../collections/sources-users');
const SourceUser = require('../models/source-user');

exports.sourceId;

exports.getSource = function(domain) {
  // Check for existence of source
  return new Source({homepage: domain}).fetch()
  // If exists grab ID
  .then(function(found) {
    if (found) {
      console.log('SOURCE FOUND', found.id);
      return found.id;
    } else {
      console.log('SOURCE NOT FOUND');
      return Sources.create({
        name: domain,
        homepage: domain/*,*/
        /*most_read: TBD,*/
        /*image: TBD*/
      })
      .then(function(newSource) {
        console.log('NEW SOURCE ID ===', newSource.id)
        return newSource.id;
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
