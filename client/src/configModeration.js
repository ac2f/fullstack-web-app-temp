const crypto = require("crypto");
const config = {};
config.config = {
    validateSecret: true,
    validatePublicIP: true,
    validateToken: true
};
/*router.get("/", async (req, res) => {
    res.send(await Users.findAll());
    //
});*/
config.aes = {};
config.aes.encrypt = function(text) {
  return crypto.createCipheriv("aes-256-gcm", ).update()
};
config.aes.decrypt = function(text) {
  return 
};
config.crypt = function(text, repeatXtimes=1){
    try {
        var repeatXtimes = (typeof(repeatXtimes)!=typeof(1)||repeatXtimes<1)?1:repeatXtimes;
        var last = "";
        for (var i=0;i<repeatXtimes;i++){
            last = crypto.createHash("sha256").update(Array.from(i<1?text:last).map((each)=>each.charCodeAt(0).toString(2)).join(" ")).digest("base64"); 
        };
        return last;
    } catch (e){
        return e;
    };
};
config.editDistance = function(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          };
        };
      };
      if (i > 0)
        costs[s2.length] = lastValue;
    };
    return costs[s2.length];
};
config.similarity = function(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    };
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    };
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};
config.elapsedTime = (value, format = "m") => {return ((Date.now() - Date.parse(value.createdAt))/(format=="m"?600000:format=="hr"?3600000:1))}
module.exports = config;