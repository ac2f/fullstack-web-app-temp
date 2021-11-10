import { Route, useHistory } from "react-router-dom";
import instagram_ico from "./images/instagram-ico.svg";
import {toast} from "react-toastify";
const axios = require("axios");
const crypto = require("crypto");
const border = require("./images/border.png");
const creeper = require("./images/creeper.png");
const parse = require("html-react-parser");
const config = {}
config.navbar = function(){
    var isLoggedIn = false;
    axios.post(config.getApiUrl("users"), {token: localStorage.getItem("token"), rtype: "hhht"}).then(resp => {
        isLoggedIn = resp.data;
    }).catch((e)=>{
        isLoggedIn = false;
    });
    return (
        <nav class="menu">
            <a href="/offers" id="home">Kullanıcı İlanları</a>
            <a href="/"><img id="dr" src={creeper}/></a>
            <a href="/"><img id="border" src={border} style={{transition: "rotate(-45deg)", transitionDuration: "1s"}} onMouseLeave={() => {}}/></a>
            {!isLoggedIn?<a href="/login" id="login">Giriş Yap</a>:null}
            {!isLoggedIn?<a href="/signup" id="signup">Kayıt Ol</a>:<a href="/profile" id="profile">Hesabım</a>}
        </nav>
    );
};
//<div className="social"><a href="/sad" id="instagram"><i class="icon ion-social-instagram"></i></a></div>
config.footer = (
    <div className="footer">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
            <footer>
                <a href="https://instagram.com/wildmarketim" id="instagram"><a class="fa fa-instagram"></a></a>
                <a id="ures" href="ks">Kullanım Şartları</a>
                <a id="cr"><a id="hl" href="/">www.wildmarketim.com</a><a> Tüm Hakları Saklıdır</a></a>
            </footer>
    </div>
);
config.loading = (<div className="loading"><div id="o"></div><a>Yükleniyor..</a></div>);
config.exceptLogoutStyle = {
    u: {filter: "blur(5px)", transition: "0.5s", pointerEvents: 'none'},
    v: {transition: "0.5s"}
};
config.setpwd = function(list = []){
    var list = typeof(list)==typeof([])?list:[];
    var out = "<div className=\"pwd\"><a href=\"/\" id=\"ic\">&#8962;</a><a href=\"/\">Ana Sayfa </a>_replaceThis_</div>";
    for (var c = 0; c<list.length;c++){
        out = out.replace("_replaceThis_", `<a>> </a><a href=\"${list[c][0]}\">${list[c][1]} </a>_replaceThis_`);
    };
    return parse.default(out.replace("_replaceThis_", ""))
};
config.section = (style = {}) => {
    return (
        <section style={style}>
        <div class="img-container">
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves1.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves2.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves3.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves4.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves1.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves2.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves3.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves4.png" alt=""/></div>
        </div>
        <div class="img-container set2">
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves1.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves2.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves3.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves4.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves1.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves2.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves3.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves4.png" alt=""/></div>
        </div>
        <div class="img-container set3">
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves1.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves2.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves3.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves4.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves1.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves2.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves3.png" alt=""/></div>
            <div class="item"><img src="https://boldman.vn/wwwroot/templates/website/global/img/leaves4.png" alt=""/></div>
        </div>
        </section>
    );
};
export default config;