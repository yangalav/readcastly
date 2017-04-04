const objBuilder = function(obj,source) {
//   console.log('source.content = ', source.content);
  // const stripper = function(html) {
  //   var tmp = '';
  //   tmp.innerHTML = html;
  //   return tmp.textContent || tmp.innerText;
  // };
  // var excerpt = stripper(source.content);
  // console.log('server.js, objBuilder, l 112. testing stripper func. excerpt = ', excerpt);

  obj.title = source.title;
  obj.text = source.content;
  obj.author = source.author || "Information not available"
  obj.publication_date = source.date_published;
  obj.image = source.lead_image_url || "https://ca.slack-edge.com/T2SUXDE72-U2T9QJWCE-ea64dc6deeb5-72";
  obj.excerpt = source.excerpt;
  obj.word_count = source.word_count;
  obj.est_time = source.word_count / 145;
  obj.domain = source.domain || domainExtractor(obj.url);
  return obj;
};

const domainExtractor = function(url) {
  let start,end;
  let i=0;
  let length = url.length;
  while (!start || !end) {
    if(url[i] === '/' && url[i+1] === '/') {
      start = i+2;
      i+=3;
    } else if (url[i] === '/' || i === length) {
      end = i;
    } else {
      i++;
    }
  }
  return url.slice(start,end);
};

module.exports = {
  objBuilder : objBuilder,
  domainExtractor: domainExtractor
};