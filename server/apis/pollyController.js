// controller for Amazon Polly API
// 1. Load SDK, set config variables, then create a Polly Instance;
require('dotenv').config();
const Promise = require('bluebird')
const AWS = require('aws-sdk')
AWS.config.accessKeyId = process.env.AWS_AKID
AWS.config.secretAccessKey = process.env.AWS_SAK
AWS.config.region = process.env.AWS_REGION
const polly = new AWS.Polly();
const s3 = new AWS.S3();
const utils = require('../utils.js');
// FOR DEBUGGING ***********************
const log = console.log; //*************
// // 2. helper function to chop up text data for Polly into manageable segments of text
//   // (i.e., within Polly input-length limits)
//   // e.g. Input: 'long chunks of text' => Output: [['long'], ['chunks'], ['of'], ['text']]

// const chopUpText = (text, charSeparator = '\n', maxLength = 1000) => {
//   log('INSIDE chopUpText') //*************
//   return text.split(charSeparator).reduce((memo, p) => {
//     if(memo[memo.length - 1].length < maxLength) {
//       memo[memo.length - 1] += charSeparator + p
//       return memo
//     }
//     else {
//       memo[memo.length] = p
//       return memo
//     }
//   }, [[]])
// }


// 3. Function that generates Audio Stream by making API call to Polly; => returns a promise object
const generatePollyAudio = (text, voiceId) => {
  log ('INSIDE generatePollyAudio') //*************
  const params = {
    Text: text,
    TextType: 'text',
    OutputFormat: 'mp3',
    VoiceId: voiceId,
    SampleRate: '22050'
  }
  // log('PARAMS:========> ', params);
  return polly.synthesizeSpeech(params).promise()
  // Promise.promisify(polly.synthesizeSpeech(params))
  // .then( audio => {
  //   if (audio.AudioStream instanceof Buffer) return audio
  //   else throw 'AudioStream is not a Buffer.'
  // })

  .then( data => {
    log ('>INSIDE generatePollyAudio-PC') //*************
    log('>DATA.AudioStream instanceof Buffer: ', data.AudioStream instanceof Buffer)
    if (data.AudioStream instanceof Buffer) return data
  })
  .catch(err => {
    console.error('AudioStream is not a Buffer.')
  })
  // .catch( err => throw 'AudioStream is not a Buffer.')
};

// 4. helper function to upload to S3 => it returns a promise object
const putObject = (bucket, key, body, contentType) =>
  s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType
  }).promise()

// 5. Function that Uploads Polly mp3 audio to Amazon S3, generating a url to serve to client
const writeAudioStreamToS3 = ( audioStream, filename ) => {
  // log('>>>>INSIDE writeAudioStreamToS3 filename: ', filename) //*************
  const bucketName = 'readcastly-user-files'
  const contentType = 'audio/mpeg'

  return putObject(bucketName, filename, audioStream, contentType)
  .then((res) => {
    log('INSIDE writeAudioStreamToS3 - res.etag: ', res.ETag)
    // log('XXXXXXXXX=========>>>>INSIDE writeAudioStreamToS3 - RES: ', res)
    if(!res.ETag) throw res
    else return {
      msg: 'File successfully generated.',
      ETag: res.ETag,
      url: `https://s3.amazonaws.com/${bucketName}/${filename}`
    }
  })
}


// 6. contains main logic of pollyController
// const textToSpeech = async (req, res) => {
const textToSpeech = (req, res, callback) => {
  // log('======BACK-B-pollyController-textToSpeech') //*************

  // Extract needed info from request object
  const articleTitle = req.body.payload.article.title
  const voiceId = req.body.payload.voice || 'Joanna' /*name of voice*/

  const textIn = req.body.payload.article.text /*text of the article*/
  const convertedTextIn = utils.unescapeHtml(textIn);
  const filename = req.body.payload.article.article_id.toString() + '.mp3'
  // || '999999999.mp3' // /*unique article_id number*/

  // also available: req.body.destination => /*e-mail address if e-mail, phone number if phone, 'stream' if stream, 'link' if link */
  // log('======BACK-C-textToSpeech: voiceId: ', voiceId, ' FILENAME: ', filename) //*************

  // SEE #2 (ABOVE): Break in parts small enough to be handled by Polly API
  // const textParts = chopUpText(text) //>>>>>>>>>>>>>>>>
  // log('>>>>>>>>>>>>textParts: ', textParts)

  const strHeadCleaner = (str) => {
    let result = str.slice();
    let index = 0;
    console.log('result.length: ', result.length);
    while(result[index] === '\n' || result[index] === ' ') {
      index++;
    }
    console.log('index: ', index);
    if (index > 0) {
      result = result.slice(index);
    }
    return result;
  }
  let text = strHeadCleaner(convertedTextIn);
  // log('======BACK-D-textToSpeech: typeof TEXT>>>: ', typeof text)
  
  const arrHeadCleaner = (arr) => {
    let result = arr.slice();
    while(result[0][0] === '\n' || result[0] === '') { 
      result.shift()
    }
    return result;
  }

  var maxWords = 230;
  var roughWords = text.split(" ");
  var words = arrHeadCleaner(roughWords);
  // var words = preWords.filter((char) => )

  var bufferarray = [];

  // log('======BACK-D2-textToSpeech: WORDS>>>: ', words);
  // log('======words.length: ', words.length);

  //Checks length of desired text to send to Polly. If the amount of Words are longer than 230 then break text into an array.
  const chopper = (arr) => {
    let palabras = words.slice();
    var result = [];
    let x;
    if (palabras.length > maxWords){
      x = 0;
      while(x < palabras.length){
         result.push(text.match(/^(?:\w+\W+){0,230}/g).join(" "));
         var check = text.split(/^(?:\w+\W+){230}/g);
         var y = 0;
         check.forEach(function(element) {
           if(element === ""){
             check.splice(y, 1);
           }
           y++;
        });
        text = check[0];
        x += maxWords;
       }
    } else {
      result.push(text);
    }
    return result;
  }
  var textArray = chopper(words);

  // log('======BACK-E-TEXT-ARRAY: >>>>>>>>> ', textArray);
  // log('INSIDE textToSpeech: voiceId: ', voiceId, ' text: ', text, ' filename: ', filename) //*************
  // SEE #3 (ABOVE): feed segments of text into polly to generate audio segments
  Promise.all(textArray.map(function(item) {
    log('ONE ITEM being mapped to generatePollyAudio call...')
    return generatePollyAudio(item, voiceId)
  }))
  .then(function(audios) { // isArray!
    // log('======BACK-F-textToSpeech >>>PC1')
    log('audios[0].AudioStream instanceof Buffer ', audios[0].AudioStream instanceof Buffer)
    // log('AUDIOS>>>>>>>>: [0] ', audios[0])
    return Promise.all(audios.map(a => a.AudioStream))
  })
  // Concatenate audio segments into single buffer object
  .then(function(audioStreams) {
    // log('======BACK-G-textToSpeech >>PC2')
    // log('>>PC2-audioStreams BUFFER?: ', audioStreams) // Array of Buffers (length: 3)
    log('LENGTH: ', audioStreams.reduce((len, a) => len + a.length, 0))
    // Buffer.concat(arrayOfBuffers, totalLengthOfBuffers)
    return (Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0))) // 1567168
  })
  // SEE #5 (ABOVE): save unifiedBuffer to s3 as mp3 file
  .then(function(unifiedBuffer) {
    // log('======BACK-H-textToSpeech >>PC3')
    // log('>>PC-3-UNIFIED BUFFER isBuffer?: ', unifiedBuffer instanceof Buffer)
    // log('PC-3-UNIFIED BUFFER.AudioStream isBuffer?: ', unifiedBuffer.AudioStream instanceof Buffer)

    return writeAudioStreamToS3(unifiedBuffer, filename)
  })
  // Return URL of audio to front-end
  .then(function(response) {
    // log('======BACK-I-textToSpeech >>PC4')
    // log('>>PC4-RESPONSE: >>> ', response)
    callback(response.url, articleTitle)
    // res.send({url: response.url})
  })
  .catch(function(err) {
    log('textToSpeech PC5-ERR', err)
    if(err.errorCode && err.error) res.status(err.errorCode).send(err.error)
    else res.status(500).send(err)
  });
}
// export default textToSpeech;
module.exports = {textToSpeech};

