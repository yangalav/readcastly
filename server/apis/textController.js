require('dotenv').config();
const twilio = require('twilio');

const client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const deleteMedia = function(message, callback) {
  client.messages(message.parent_sid).media(message.sid).delete(function(err, data) {
    if (err) {
        console.log('ERROR DELETING MEDIA AFTER SENDING', error);
        throw err.message;
    } else {
        console.log("Media deleted successfully.");
        callback(data);
    }
  });
};

const sendText = function(phone,readcast,callback) {
  client.messages.create({
      body: 'Readcast.ly presents "' + readcast.title + '"',
      to: phone,
      from: process.env.TWILIO_NUMBER,
      mediaUrl: readcast.location
    }, function(err, message) {
         if(err) {
           console.error('TWILIO ERROR ', err.message);
         } else {
           deleteMedia(message,callback);
         }
    });
};

module.exports = { sendText: sendText };