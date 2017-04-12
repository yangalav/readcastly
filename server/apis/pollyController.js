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
    log ('--INSIDE generatePollyAudio-PC') //*************
    log('--data.AudioStream instanceof Buffer: ', data.AudioStream instanceof Buffer)
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
  log('INSIDE writeAudioStreamToS3 filename: ', filename) //*************
  const bucketName = 'readcastly-user-files'
  const contentType = 'audio/mp3'
  return putObject(bucketName, filename, audioStream, contentType)
  .then((res) => {
    console.log('INSIDE writeAudioStreamToS3 - res.etag: ', res.ETag)
    if(!res.ETag) throw res
    else return {
      msg: 'File successfully generated.',
      ETag: res.ETag,
      url: `https://s3.amazonaws.com/${bucketName}/${filename}.mp3`
    }    
  })
}


// 6. contains main logic of pollyController
// const textToSpeech = async (req, res) => {
const textToSpeech = (req, res, callback) => {
  log('INSIDE textToSpeech') //*************
  
  // Extract needed info from request object
  const voiceId = req.body.payload.voice || 'Joanna' /*name of voice*/
  let text = req.body.payload.article.text || '' /*text of the article*/
  const filename = req.body.payload.article.article_id.toString() || '999999999' /*unique article_id number*/ 
  // also available: req.body.destination => /*e-mail address if e-mail, phone number if phone, 'stream' if stream, 'link' if link */
  log('INSIDE textToSpeech: voiceId: ', voiceId, ' FILENAME: ', filename) //************* 


  // SEE #2 (ABOVE): Break in parts small enough to be handled by Polly API
  // const textParts = chopUpText(text) //>>>>>>>>>>>>>>>>
  // log('>>>>>>>>>>>>textParts: ', textParts)
  
  var maxWords = 230;
  var words = text.split(" ");
  var textArray = [];
  var bufferarray = [];

  //Checks length of desired text to send to Polly. If the amount of Words are longer than 230 then break text into an array.
  if (words.length > maxWords){
    x = 0;
    while(x < words.length){
       textArray.push(text.match(/^(?:\w+\W+){0,230}/g).join(" "));
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
    textArray.push(text);
  }
  log('TEXT-ARRAY: >>>>>>>>> ', textArray);


  // SEE #3 (ABOVE): feed segments of text into polly to generate audio segments
  Promise.all(textArray.map(function(item) {
    log('ONE ITEM being mapped to generatePollyAudio call...')
    return generatePollyAudio(item, voiceId)
  }))  
  .then(function(audios) { // isArray!
    log('textToSpeech pc1')
    log('audios[0].AudioStream instanceof Buffer ', audios[0].AudioStream instanceof Buffer)
    log('AUDIOS>>>>>>>>: [0] ', audios[0]) 
    return Promise.all(audios.map(a => a.AudioStream))
  })
  // Concatenate audio segments into single buffer object
  .then(function(audioStreams) {
    log('PC2-audioStreams: ', audioStreams)
    log('textToSpeech pc2')
    return (Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0))) // audioStreams.reduce((len, a) => len + a.length, 0)
  })
  // SEE #5 (ABOVE): save unifiedBuffer to s3 as mp3 file
  .then(function(unifiedBuffer) { 
    log('PC-3-UNIFIED BUFFER: ', Array.isArray(unifiedBuffer))

    log('textToSpeech pc3')
    return writeAudioStreamToS3(unifiedBuffer.AudioStream, filename)
  })
  // Return URL of audio to front-end
  .then(function(response) {
    log('PC4-RESPONSE: ', response)
    log('textToSpeech pc4')
    callback(response.url)
    // res.send({url: response.url})
  })
  .catch(function(err) {
    log('textToSpeech pc5-ERR', err)
    if(err.errorCode && err.error) res.status(err.errorCode).send(err.error)
    else res.status(500).send(err)    
  });
}
// export default textToSpeech;
module.exports = {textToSpeech};







