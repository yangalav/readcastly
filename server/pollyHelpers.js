/* pollyHelpers.js: a file of helper methods used in pollyController */

// function to convert hexadecimal character codes into their character equivalents; 
const unescapeTextAgain = function(unsafe) {
  return unsafe
    .replace(/&quot;/g, "\"")    
    .replace(/&apos;/g, "\'") 
    .replace(/&amp;/g, "and") 
    .replace(/\)(\w)/g, "\) $1")
    .replace(/\.([A-Z])/g, "\. $1")
    .replace(/(\w)(\<)/g, "$1 $2")
    .replace(/&#x22;/g, "\"")
    .replace(/&#x201(C|D);/g, "\"")
    .replace(/&#x201(8|9);/g, "\'")    
    .replace(/&#xA0;/g, " ")    
    .replace(/&#x2026;/g, "...")
    .replace(/&#?\w+;/g, "-") /* catch-all for other hex char patterns, replacing them with a "-" */
}

// function to break up any array of text longer than maxWords (230) words into subarrays;
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
  console.log('result.length: ', result.length); //***
  while(result[index] === '\n' || result[index] === ' ') index++;
  console.log('index: ', index); //***
  if (index > 0) result = result.slice(index);
  return result;
}

// method to remove any leading white-spaces and carriage-returns from text array
const arrHeadCleaner = (arr) => {
  let result = arr.slice();
  while(result[0][0] === '\n' || result[0] === '') result.shift()
  return result;
}

// method to extract and hyphenate the first five words in an article title, for use in the url/mp3 name
const titleAbbreviator = (title) => title
  .replace(/[^A-Za-z0-9\s]+/g, '')
  .split(' ').slice(0, 5)
  .join('-')
  .toLowerCase();

// export above methods in order to expose them in pollyController
  // Note the use of object destructuring ({an, es6, feature})
module.exports = {
  unescapeTextAgain,
  chopper,
  strHeadCleaner,
  arrHeadCleaner,
  titleAbbreviator
};

