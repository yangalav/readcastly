// controller for Amazon Polly API

// 1. Load SDK, set config variables, then create a Polly Instance;  
require('dotenv').config();
const AWS = require('aws-sdk')
AWS.config.accessKeyId = process.env.AWS_AKID
AWS.config.secretAccessKey = process.env.AWS_SAK
AWS.config.region = process.env.AWS_REGION 
const polly = new AWS.Polly(); 


// 2. helper function to chop up text data for Polly into manageable segments of text 
  // (i.e., within Polly input-length limits)
  // e.g. Input: 'long chunks of text' => Output: [['long'], ['chunks'], ['of'], ['text']]
const chopUpText = (text, charSeparator = '\n', maxLength = 1000) => {
  return text.split(charSeparator).reduce((memo, p) => {
    if(memo[memo.length - 1].length < maxLength) {
      memo[memo.length - 1] += charSeparator + p
      return memo
    }
    else {
      memo[memo.length] = p
      return memo
    }
  }, [[]])
} 


// 3. Function that generates Audio Stream by making API call to Polly; => returns a promise object  
const generatePollyAudio = (text, voiceId) => {
  const params = {
    Text: text,
    TextType: 'text',
    OutputFormat: 'mp3',
    VoiceId: voiceId,
    SampleRate: '22050' 
  }
  Promise.resolve(polly.synthesizeSpeech(params))
  .then( data => {
    if (data.AudioStream instanceof Buffer) return data
  })
  .catch( err => throw 'AudioStream is not a Buffer.') 
};


// 4. helper function to upload to S3 => it returns a promise object
const putObject = (bucket, key, body, ContentType) =>
  Promise.resolve(
    s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType
    }))

// 5. Function that Uploads Polly mp3 audio to Amazon S3, generating a url to serve to client
const writeAudioStreamToS3 = ( audioStream, filename ) =>
  const bucketName = 'readcastly-user-files'
  // SEE #4 (ABOVE)
  putObject(bucketName, filename, audioStream,'audio/mp3').then( res => {
    if(!res.ETag) throw res
    else return {
      msg: 'File successfully generated.',
      ETag: res.ETag,
      url: `https://s3.amazonaws.com/${bucketName}/${filename}`
    }
  })


// 6. contains main logic of pollyController
export const textToSpeech = async (req, res) => {
  
  // Extract needed info from request object
  const { voiceId = 'Joanna', text = '', filename = 'speech.mp3', type = 'file' } = req.body  
  
  // SEE #2 (ABOVE): Break in parts small enough to be handled by Polly API
  const textParts = chopUpText(text) 

  // SEE #3 (ABOVE): feed segments of text into polly to generate audio segments
  textParts.map((onePart) => await generatePollyAudio(onePart, voiceId))
  .then(function(audios) {
    return audios.map(a => a.AudioStream)
  })
  // Concatenate audio segments into single buffer object
  .then(function(audioStreams) {
    return Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0))
  })
  // SEE #5 (ABOVE): save unifiedBuffer to s3 as mp3 file
  .then(function(unifiedBuffer) { 
    return writeAudioStreamToS3(unifiedBuffer.AudioStream, filename)
  })
  // Return URL of audio to front-end
  .then(function(response) {
    res.send({url: response.url})
  })
  .catch(function(err) {
    if(err.errorCode && err.error) res.status(err.errorCode).send(err.error)
    else res.status(500).send(err)    
  });
}
