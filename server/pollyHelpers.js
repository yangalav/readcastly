/* file of helper methods used in pollyController */

// function to convert hexadecimal character codes into their character equivalents; 
const unescapeHtml = function(unsafe) {
  return unsafe
    .replace(/&#x22;/g, "\"")
    .replace(/&#x2013;/g, "–")    
    .replace(/&#x2014;/g, "—")
    .replace(/&#x2018;/g, "\'")    
    .replace(/&#x2019;/g, "\'")
    .replace(/&#x2026;/g, "...")
    .replace(/&#x201C;/g, "\"")
    .replace(/&#x201D;/g, "\"")
    .replace(/&#xAD;/g, "-")
    .replace(/&apos;/g, "\'")
    .replace(/&#x200A;/g, "–")
    .replace(/&#xA0;/g, " ")
    .replace(/&quot;/g, "\"")
}

// function to break up any array of text longer than maxWords (230) words into an array of text subarrays;
const chopper = (arr, text, maxWords) => {
  let palabras = arr.slice();
  var result = [];
  let x;
  if (palabras.length > maxWords){
    x = 0;
    while(x < palabras.length) {
      result.push(text.match(/^(?:\w+\W+){0,230}/g).join(" "));
      var check = text.split(/^(?:\w+\W+){230}/g);
      var y = 0;
      check.forEach(function(element) {
        if(element === "") check.splice(y, 1);
        y++;
      });
      text = check[0];
      x += maxWords;
    }
  }
  else result.push(text);
  return result;
}

// method to remove any leading white-spaces and carriage-returns from string input
const strHeadCleaner = (str) => {
  let result = str.slice();
  let index = 0;
  console.log('result.length: ', result.length);
  while(result[index] === '\n' || result[index] === ' ') index++;
  console.log('index: ', index);
  if (index > 0) result = result.slice(index);
  return result;
}

// method to remove any leading white-spaces and carriage-returns from text array
const arrHeadCleaner = (arr) => {
  let result = arr.slice();
  while(result[0][0] === '\n' || result[0] === '') result.shift()
  return result;
}

// export methods in order to expose them in pollyController
module.exports = {
  unescapeHtml: unescapeHtml,
  chopper: chopper,
  strHeadCleaner: strHeadCleaner,
  arrHeadCleaner: arrHeadCleaner
};

