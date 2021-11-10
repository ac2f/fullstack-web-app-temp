const { default: axios } = require("axios");
const crypto = require("crypto");
const aes256 = require("aes256");
const publicIP = require("public-ip");
const config = {
  apiUrl: {
    host: "http://127.0.0.1:3001",
    stocks: "%s/stocks",
    users: "%s/users",
    offers: "%s/offers",
    purchases: "%s/purchases",
    verificationIndex: "%s/s",
  },
  getApiUrl: (route) => {
    return config.apiUrl[route].replace("%s", config.apiUrl.host);
  },
  generateEncryptedHeader: (header = {}) => {
    const x = {};
    for (var i = 0; i < 20; i++) {
      x[i] = config.aes.encrypt("null|null|".repeat(7), `headers${i}`);
    };
    for (var value in header) {
      var m = `${header[value]};;|$|;.;${parseInt(Date.now()/15000)}`;
      x[value] = config.aes.encrypt(`${m}${m.length<69?"|"+"А".repeat(69-m.length):""}`, `headers${value}`);
    };
    return x;
  },
  parseHeader: (requestBody) => {
    // 0 = rtype  1 = username  2 = email  3 = password  4 = passwordNew  5 = verificationCode  9 = supportAccessCode  10 = supportTicketID  11 = supportMessage  12 = supportTicketSender  13 = supportTicketTitle
    // 14 = supportTicketText  15 = oldToken  16 = token  17 = senderIP  18 = timeInterval  19 = secureCode
    const x = {};
    for (var value in requestBody) {
      x[value] = config.aes.decrypt(requestBody[value], `headers${value}`);
      x[value] = x[value] == "null|".repeat(14) ? null : x[value]; 
      if (x[value]) {
        if (x[value].indexOf(";;|$|;.;")>=0) {
          var xx = x[value].split(";;|$|;.;")[0];
          x[value] = "";
          var tf = false;
          for (var index = xx.length-1; index >= 0; index--) {
            tf = xx[index] == "|";
            if (tf && xx[index+1] == "А") {break;}
            x[value] += xx[xx.length-1-index];
          };
        };
      };
    };
    return x;
  },
  parseMysqlDate: (date, utc = 3) => {
    try {
      var days = date.split("T")[0].split("-");
      var minutes = date.split("T")[1].split(".")[0].split(":");
      return `${days[2]}/${days[1]}/${days[0]} - ${parseInt(minutes[0])+utc}:${minutes[1]}:${minutes[2]}`;
    } catch (error) {
      return date;
    }
  },
  purchasesFilterDate: function (data, interval) {
    var temp = data;
    var temp2 = [];
    for (var record in temp) {
      //259200000
      console.log(Date.parse(temp[record].createdAt)/2592000000, 6985322);
      console.log(parseInt((Date.now() - Date.parse(temp[record].createdAt))/2592000000) <= interval, 698532220);
      if ((Date.now() - Date.parse(temp[record].createdAt))/2592000000 <= interval) {
          temp2.push(temp[record]);
          console.log(["a", 2 ,2,3 ,23,2,32,32,32,3,2, 3,23,23,2],6985322)
      };
    };
    console.log(temp2, 309999921)
    return temp2;
  },
  config: {
    validateSecret: false,
    validatePublicIP: false, // Token won't be updated if enabled
    validateToken: true,
    timeouts: {
      changePassword: 3600, // seconds
    },
  },
  aes: {
    pass: {
      stocks: "`kk@,8RX%\\x0btsp%eu3_=VFik\\pc#naC;Q",
      token: ".c\\tA#TQr*_YSNOxl{&?5Yxsg4=rH#\\x0b&j",
      vars: "Iy($\\tAE( WjPkBT5'+\\x0c3!s`\\x0b3 ^P@N<",
      headersDef: "t4Pvu}?5%se\\x0cYaZ1,(s]2H0K?5@\t4n\"=\\n V~TKzw`",
      headersNull: "\\t^CL'xbeovpY~IO HuTd\\rDQHCHEbO:v~-lt1g\\rO#'D..<k(&$v1s&<DG`WTqq[c}^33YoY\\tw~|7Q6_FE=d\\n|]ri\\+NZcf<)z",
      headers0: " (v8BE+\\r3t3\\JfP))oZ~7V!\\x0cfY\\x0c%nqqeR]]&8pFQ-M,+Te\\x0cBrsxV\\tEtl?Dq\\n#Cx&[`$pN`HpTiQ\"zr~mZFKV;*[DBI_ENP63",
      headers1: "<6ka2f$]Y\\x0bSqh9C%Cc]!|\\x0b/\"\"kj!r5/.*WptOY6?8a2$u(|%0M>rl[,={P8/xlO}D(% :yW7tRtU\\x0cdr,-Jj167Vtc{GrT&!y",
      headers2: "1wQ\\x0cN'1U#ut{qT4Wt5Uv0u?:-nh'U583r^<(k$w<f`GJ$mBO#VSI\\5pW\\x0csfB\\*bNy0krY+ bZ$7$ l:\\x0cV}'t\\Dn]S/eCdu>n",
      headers3: "+L[hSU\\tg88'E'cy2J}\\_|iy6NR'v{%s'XqQ!'kO<\\uYwT.aYCkJ[/F{*q'fr\\x0b6KZ+i:+iZn]'O4xkJqdYu-DEF?]!+STj%`>",
      headers4: "buo #in~'MrCIm,nNRculeUvH{Z|?\\\\t&yrK,sJ1ep\\q\\r\\&V_\\PVNt>!Q~je{zqs>\\rXVN+f+T?R\\n.M\\_ xr\\R!^,O\\x0b:O l\\!",
      headers5: "p!oG(R[6n\\rORpBeyruT`&bT7U$Tg\\tYdfxi21RbjX{?>rYr\\r+&GG^/WFK7T$Zu=\\x0b)ngrO4SUD,%H\\_{`&|%|tL}\\j ^1+s@\\r@",
      headers6: "='^0E?iEk~n\\t0A\\r{,a}~Ja.I#WsqYIQU~#Yt+4#|My7.s@ey/s73A}\\o{X\\8}{g[~FN=-Kf*<5],$p(M7R>\\fG\\'\\3,H`4yd",
      headers7: "%nT4j_IL9s6r;\\RV6-6tgl 4X\\XW@2yZ\\t$2Q?Y00{?-b$gT{0jml'F^vNh79&FT79KBk3\\t}ypcJ/IMGg)m9=?%7H}\\cr8WU'",
      headers8: "@%C\\x0c>w&ar9Bz}']]on>Tc$?[*f\\4{)#.~6(no\\~\\/F=m\\FWt>8@^ RWk+o!OM]+w2Bc:I&2bBHyUh%;8cl\\:<%#T2AnS\\rVf_",
      headers9: "O/A\\x0bbbYEz6f;nUF\\S%'|JFjL0q&Oh9~o^B.!P8}SPV;2hSu$B\\Nj'u}L&hm*,]K+]tq 3a.Ee7<Im$Rtp`Q}sIoanih\\rz{4~",
      headers10: "wo67\\x0c U\\cheI!F!<OGkw*0}h*MNDV5D,V`ha\\x0c\\rWn#1L\\SWb\\~fxfD|=\\x0ckz{ZWt/ws3CMw)FivH%\\x0c\\_,zv>k/m(EjECD'h!)T",
      headers11: "s<8:Qbq2{x`\\rj%pFh'_fJ0%|H(~M{_|=1f?~7porxf6s/2-Wza\\Cj;HO~Lq|]sQ=~Q2 *St5'%Xu4|ITrsip`d(Qz?yC[0+\\x0b",
      headers12: "n7sZET>!@r^qScoRK)iuk/%bpS7PM|fjFd_#2<r68CL)}$G{S{4tYx 4[\\t&!pIP=7jJ<^b(u\\n=^c%hL[Qv2jF~G1g5^\\x0b/Y;",
      headers13: "XXg/Qi8s~A/Ot3z}_2J>]K-1c#B5syrh+!V9*BYYg:TJ:&,CJc9=RK+JfkpwT8?'Lgo6v|b]wp?G*E\\x0c:_,T2G)\\r'tHn(Z2cu",
      headers14: "BD*v`yd/.2^q498`ZLl*Nj<6U._XX+PGVuQK$<BPe\\a.rnNZMB'8uHLKh[{.#q#x]EL\\\\r:!3V\\t1EPfn#<rk>:e|mugR8c<1t",
      headers15: "\\f_Qnj?pcLaQe.z[`s!k@5Ge\\x0cof0}XnX3yWMsKmK+S!p`MqAW@g8=\\x0c:nCqjWLK<!8\\t}=~{!TIz;WBCRA,{~6NC.Tyr-!o*u\\",
      headers16: "ohK@E=k&e( 3\\p\\)!^Hf;v8l}W\\:ve(#'65=!o\\tI{N`%\th^_c\\x0c3z\\8R\\rTf\\r*tX8/locoZr8\\7^IC}sss^kVsHI0aaZ!`V\\x0cjR",
      headers17: "T~||DM\\x0ba.S^(AL\\rE\\x0bZiAt_\\x0c<hb+&[4BH~`</?\\t[\\g/o\\r=2nRhl)w cL\\x0bHa!',Ap,Nnc@4d1TaZe|!LHxMi W|^BZ>+3bm.L6",
      headers18: "w\\/RN[Ro\\x0b=upfwI#{bQ-u]JsJozof;\\x0c'Jj0mS$0M|3~_w4D-9eef\\Ix]|md)6a3U@@|Z\\\\x0cFhjLz$9%}v_<}S?\\r-\\xh'J5^xn",
      headers19: ":j)w]\\f]wAl=<sjMU/MDW}*8'l~4L*&l4=%n\\x0bkwxUf,dZECPJ|;{y&*MRo uU92i.I\\rLUi5]yE(8%<'K?v<J7\\*?-$ZcS`.4",
      headersRtypeKey: "_E?&Vn?w\\r?RQ;v8ba;#/Y;Wd\\S[a`$5o0=Bxrsls\\",
      headersRtypeValue: "+u0\\nmPbN_;Yl1Q-KS}P9C`*5$;665Z<6EE%s1Z\\dh",
      headersUserKey: "hHr%'/B%])8MGHe^+`H6_o4}aq =o0rkc0BNA\\tMe+",
      headersUserValue: "\\t:wboJe`7z[fISo\\r<lG{\\nWn5n&pNrIskaPO~C3feE",
      headersTimeIntervalKey: "#R df-/D%},3DDVmn!i16Kt^/\"qZC-_/%{Moq\'3yG",
      headersTimeIntervalValue: "Zn?\"`]\\x0b\\x0b4x?&$pAqH)q]w\\x0bI5E\"Yi%z|LUAoTQ<3ti",
      headersVerificationIndexKey: "X8$B\"g@\\rp&@2Z\\t\\x0be%>2y[aPf!^!-Upi{\\twHe}dLp%", 
      headersVerificationIndexValue: "\\t6dHg\\n@H9*6\\x0c{(H!Ig6K\\tH\\r7e.&s:{0(8Kjb|;`W\\t",
      responseSec: "Ri?733L/F:1>\\x0c+PwFn0z}dr.aRenxjwMk' ebZ:ot",
      supportTicketID: "k~F.5H1c> 9,c[lDO&A\\\\\\>\"Mr_GE\\0KGPg61\\x0c+\"VSjT\\KV_Ox\\x0be\'I&pupX*WbpBZk`_\\x0cnvFX)~`j,Y,?8^P*5-S|&",
      supportTicketTitle: "v\\ruIm\\x0bU}L48+Q>*AHG>\\r+K$g6^\\r)B2^-H8K,EO\\j1Sz~\\x0b7gYNju\\d[e\\x0b t%V7}@+.V`6yWN\n$Fw|=~Qq*8\\nB;:#]E\\r'",
      supportTicketUsername: "O7Ov8b\'73\r+dXf6,\"|\t%WnM@\\x0cyHGiH^emCi1\\x0b\twBZ4WQho>DJXK\\r<6$<fsU{(29q^,8uf)\tB!Z_+bI!+IHoN~pD.p<",
      supportTicketStatus: "\\nm7!SYTUMq^bF\\x0bC?xj\\L}Uf!?DQdyvh>LFAowtL]{cq(vGy,W[uN~AW)m<-FvD\"\\n\\rc8D;pE^%1o1y\\,<0p=f4lQ;8;",
      supportTicketMessage: "p[\\n&\\x0bh+\\x0b/:VsF]+{Q\\x0b.<c\\r\\tA\\n\\t-c;bXg71!79}{yj@=2c7GpC,2|lfj'2kLl#{8~iMir@FE>\\na?ak2UzK91/ OBfI6",
      supportTicketMessageSender: "x^C[2i/\\x0bdG>cVIYHT[Xq:\"K\\x0cmWwF|f/8Xbc=D;9R`U0b#pl+5pu]5K^Fz*eh8#&,Y\'3oi0MX<\\x0bn6;Z2\\t\\x0cL/01\\,j=5"
    }
  }
};
config.randomInteger = function(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)); //The maximum is exclusive and the minimum is inclusive
}
config.aes.decrypt = function(text, key) {
  try {
    return text.length>0?aes256.decrypt(config.aes.pass[key], text):null;
  } catch (e) {
    return null;
  };
};
config.aes.encrypt = function(text, key) {
  try {
    return text.length>0?aes256.encrypt(config.aes.pass[key], text):null;
  } catch (e) {
    return null
  };
};
config.crypt = function(text, repeatXtimes=1){
    try {
        repeatXtimes = (typeof(repeatXtimes)!=typeof(1)||repeatXtimes<1)?1:repeatXtimes;
        var last = "";
        for (var i=0;i<repeatXtimes;i++){
            last = crypto.createHash("sha256").update(Array.from(i<1?text:last).map((each)=>each.charCodeAt(0).toString(2)).join(" ")).digest("base64"); 
        };
        return last;
    } catch (e){
        return e;
    };
};
config.ping = async function(){
  axios.post(config.getApiUrl("users"), {rtype: "hhhp", test: config.crypt(await config.getPublicIP(), 7)}).then((resp)=>{}).catch(e=>{});
};
config.tokenDecrypt = function(input){
  var token = localStorage.getItem("token");
  if (token){
    if (input){
      try {
          return config.aes.decrypt(token, "token");
      } catch (error) {};
    };
  } else {
    return "";
  };
  return false;
};
config.checkToken = async function(){
  var token = localStorage.getItem("token");
  return (axios.post(config.getApiUrl("users"), config.generateEncryptedHeader({0: "hhht", 16: token, 17: config.crypt(await config.getPublicIP(), 7)})).then(resp => {
      if (resp.data=="ipNotMatch"){
        localStorage.removeItem("token");
      };
      return resp.data;
    }).catch((e)=>{
        return false;
    }));
};
config.getPublicIP = async function(){
  return (await axios.get("https://jsonip.com").then(async(e)=>{return(await e.data.ip)}).catch(e=>{return "false"}));
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
    return (longerLength - config.editDistance(longer, shorter)) / parseFloat(longerLength);
};
config.elapsedTime = (value, format = "m") => {return ((Date.now() - Date.parse(value.createdAt))/(format=="m"?600000:format=="hr"?3600000:1))}
module.exports = config;