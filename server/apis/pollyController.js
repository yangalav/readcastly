/* pollyController.js: for interacting with Amazon Polly API */

// 1. Load AWS-SDK; set config variables; create a Polly Instance;
require('dotenv').config();
const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.accessKeyId = process.env.AWS_AKID
AWS.config.secretAccessKey = process.env.AWS_SAK
AWS.config.region = process.env.AWS_REGION
const polly = new AWS.Polly();
const s3 = new AWS.S3();
const pollyHelpers = require('../pollyHelpers');

const utils = require('../utils.js'); /* Note: this one may no longer be needed due to pollyHelpers */
const log = console.log; /* FOR DEBUGGING */
const line = '========='; /* FOR DEBUGGING */

// 2. Function that generates Audio Stream by making API call to Polly; => returns a promise object
const generatePollyAudio = (text, voiceId) => {
  log ('INSIDE generatePollyAudio')  /* FOR DEBUGGING */
  const params = {
    Text: text,
    TextType: 'text',
    OutputFormat: 'mp3',
    VoiceId: voiceId,
    SampleRate: '22050'
  }
  log('PARAMS:========> ', params);  /* FOR DEBUGGING */
  return polly.synthesizeSpeech(params).promise()

  .then( data => {
    log('>INSIDE generatePollyAudio-PC')  /* FOR DEBUGGING */
    log('>DATA.AudioStream instanceof Buffer: ', data.AudioStream instanceof Buffer)  /* FOR DEBUGGING */
    if (data.AudioStream instanceof Buffer) return data
  })
  .catch(err => {
    console.error('AudioStream is not a Buffer.')
  })
};

// 3. helper function to upload to S3 => it returns a promise object
const putObject = (bucket, key, body, contentType) =>
  // the s3 method to place an object in our AWS s3 'readcastly' storage bucket
  s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType
  }).promise()

// 4. Function that Uploads Polly mp3 audio to Amazon S3, generating a url to serve to client
const writeAudioStreamToS3 = ( audioStream, filename ) => {
  log(line, 'INSIDE writeAudioStreamToS3 filename: ', filename)  /* FOR DEBUGGING */
  const bucketName = 'readcastly-user-files'
  const contentType = 'audio/mpeg'
  // SEE: # 3 (ABOVE)
  return putObject(bucketName, filename, audioStream, contentType)
  .then((res) => {
    log('INSIDE writeAudioStreamToS3 - res.etag: ', res.ETag)  /* FOR DEBUGGING */
    log(line, 'INSIDE writeAudioStreamToS3 - RES: ', res)  /* FOR DEBUGGING */
    if(!res.ETag) throw res
    else return {
      msg: 'File successfully generated.',
      ETag: res.ETag,
      url: `https://s3.amazonaws.com/${bucketName}/${filename}`
    }
  })
}

// 5. contains main logic of pollyController
// Note: callback is passed in and invoked at the bottom of the promise chain
const textToSpeech = (req, res, callback) => {
  log(line, 'BACK-B-pollyController-textToSpeech')  /* FOR DEBUGGING */

  // Extract needed info from request object
  const articleTitle = req.body.payload.article.title;
  const shortlyTitle = pollyHelpers.titleAbbreviator(articleTitle);
  const voiceId = req.body.payload.voice || 'Joanna' /*name of voice*/
  const textIn = req.body.payload.article.text /*text of the article from request object*/
  const convertedTextIn = pollyHelpers.unescapeTextAgain(textIn); /*text of the article after converting hex characters*/
  const filename = shortlyTitle + '-' + (req.body.payload.article.article_id || 'temp').toString() + '-' + voiceId.toLowerCase() + '.mp3' /*unique article_id number*/
  // || '999999999.mp3' // /*unique article_id number*/
  // also available: req.body.destination => /*e-mail address if e-mail, phone number if phone, 'stream' if stream, 'link' if link */

  log(line, 'BACK-C-textToSpeech: voiceId: ', voiceId, ' FILENAME: ', filename)  /* FOR DEBUGGING */

  // remove any leading white-spaces and carriage-returns from string input
  let text = pollyHelpers.strHeadCleaner(convertedTextIn);
  log(line, 'BACK-D-textToSpeech: typeof TEXT>>>: ', typeof text)  /* FOR DEBUGGING */

  // turn string into array, in order to count words total
  var roughWords = text.split(" ");
  var words = pollyHelpers.arrHeadCleaner(roughWords);
  log(line, 'BACK-D2-textToSpeech: WORDS>>>: ', words); // LOTS  /* FOR DEBUGGING */
  log(line, 'BACK-D2-words.length: ', words.length);  /* FOR DEBUGGING */

  // ...Check length of desired text to send to Polly; If longer than 230 words, break up into subarrays.
  var textArray = pollyHelpers.chopper(words, text, 230);

  // ... clean the title, then add it to the front of textArray.
  var titleText = pollyHelpers.strHeadCleaner(articleTitle);
  textArray[0] = titleText + '. ' + textArray[0];

  log(line, 'BACK-E-TEXT-ARRAY: >>>>>>>>> ', textArray); // LOTS /* FOR DEBUGGING */
  log(line, 'BACK-E-textToSpeech: voiceId: ', voiceId, ' text: ', text, ' filename: ', filename) /* FOR DEBUGGING */

  // ...make (multiple) asynchronous calls, managed with Promise.all,
  Promise.all(textArray.map(function(item) {
    log('\nONE ITEM being mapped to generatePollyAudio call: ==> ', item) // LOTS /* FOR DEBUGGING */
    // ... SEE #2 (ABOVE): to feed segments of text into polly, generating audio data for each of them
    return generatePollyAudio(item, voiceId)
  }))
  // ...audios is passed as an array of buffer objects
  .then(function(audios) {
    log(line, 'BACK-F-textToSpeech >>>PC1')  /* FOR DEBUGGING */
    log(line, 'audios[0].AudioStream instanceof Buffer ', audios[0].AudioStream instanceof Buffer) /* FOR DEBUGGING */
    log(line, 'AUDIOS: [0] ', audios[0])  /* FOR DEBUGGING */
    return Promise.all(audios.map(a => a.AudioStream))
  })
  .then(function(audioStreams) {
    log(line, 'BACK-G-textToSpeech >>PC2 ', audioStreams) // Array of Buffers  /* MH: DEBUGGING */
    // ...Concatenate multiple audio buffers into single buffer object
    // ...using Node.js method => Buffer.concat(arrayOfBuffers, totalLengthOfBuffers)
    return (Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0)))
  })
  // ...SEE #5 (ABOVE): save unifiedBuffer to s3 as mp3 file
  .then(function(unifiedBuffer) { /* Note: unifiedBuffer is a Buffer object */
    log(line, 'BACK-H-textToSpeech >>PC3')  /* FOR DEBUGGING */
    return writeAudioStreamToS3(unifiedBuffer, filename)
  })
  // ...Return URL of audio and articleTitle to front-end by passing them into callback invocation
  .then(function(response) {
    log(line, 'BACK-I-textToSpeech >>PC4')  /* FOR DEBUGGING */
    callback(response.url, articleTitle)
  })
  // ...any errors along the promise chain will be caught in the catch block below
  .catch(function(err) {
    log(line,'textToSpeech PC5-ERR', err)  /* FOR DEBUGGING */
    if(err.errorCode && err.error) res.status(err.errorCode).send(err.error)
    else res.status(500).send(err)
  });
}

module.exports = {textToSpeech};
