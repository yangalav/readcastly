const db = require('../dbConfig');
const Sources = require('../collections/sources');
const Source = require('../models/source');
const SourcesUsers = require('../collections/sources-users');
const SourceUser = require('../models/source-user');

const getSource = function(domain) {
  // Check for existence of source
  return new Source({homepage: domain}).fetch()
  // If exists grab ID
  .then(function(found) {
    if (found) {
      console.log('SOURCE FOUND', found);
      return {id: found.id, name: found.attributes.name};
    } else {
      console.log('SOURCE NOT FOUND');
      return Sources.create({
        name: domain,
        homepage: domain/*,*/
        /*most_read: TBD,*/
        /*image: TBD*/
      })
      .then(function(newSource) {
        console.log('NEW SOURCE ID ===', newSource.id, newSource.attributes.name);
        return {id: newSource.id, name: newSource.name};
      })
      .catch(function(error) {
        console.log('ERROR CREATING SOURCE IN ARTICLE CONTROLLER', error);
      });
    }
  })
  .catch(function(error) {
    console.log('ERROR GETTING EXISTING SOURCE ID IN ARTICLE CONTROLLER', error);
  });
};

module.exports = {
  getSource : getSource
};
