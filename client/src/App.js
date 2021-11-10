/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Offers from "./pages/Offers";
import * as EmailValidator from 'email-validator';
import {isIE, isLegacyEdge, isMobile, isDesktop} from "react-device-detect";
import React, { useEffect, useState, useRef } from "react";
import useEventListener from "@use-it/event-listener";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  useHistory,
} from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import avatar from "./images/avatar.png";
import axios from "axios";
import configComponents from "./configComponents";
const config = require("./config");

Array.prototype.replace = function (t, v) {
  if (this.indexOf(t) != -1) {
    this[this.map((e, i) => [i, e]).filter((e) => e[1] == t)[0][0]] = v;
  }
};
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}
const images = importAll(
  require.context("./images", false, /\.(png|jpe?g|svg)$/)
);
const imagePreviews = importAll(
  require.context("./images/previews", false, /\.(png|jpe?g|svg)$/)
);
function elapsedTime(value, format = "m") {
  return (
    (Date.now() - Date.parse(value.createdAt)) /
    (format == "m" ? 600000 : format == "hr" ? 3600000 : 1)
  );
}
const 
Profile = () => {
  let history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenCheckMessage, setTokenCheckMessage] = useState(false);
  const [tokenCMSplit, setTokenCMSplit] = useState({});
  const [menu, setMenu] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState({ old: "", new: "" });
  const [timeInterval, setTimeInterval] = useState(3);
  const [purchases, setPurchases] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [showLogoutWindow, setShowLogoutWindow] = useState(false);
  const [timeCheckPoint, setTimeCheckPoint] = useState(0);
  const [secureCode, setSecureCode] = useState(0);
  const menuRoutes = {
    0: (
      <div id="page">
        <h3 id="emailTitle">E-Posta</h3>
        <div id="cont">
          <a
            id="emailContent"
            style={{
              color: tokenCMSplit[3]
                ? "rgb(30,155,30,0.7)"
                : "rgb(155,30,30,0.5)",
            }}
          >
            {tokenCMSplit[2]}
            <a
              id="iv"
              style={{
                backgroundColor: tokenCMSplit[3]
                  ? "rgb(30,155,30,0.7)"
                  : "rgb(155,30,30,0.5)",
              }}
              title={
                !tokenCMSplit[3]
                  ? "E-Posta adresiniz doğrulanmadı"
                  : "E-Posta adresiniz doğrulandı"
              }
            >
              {tokenCMSplit[3] ? "\u2713" : "\u2613"}
            </a>
          </a>
        </div>
        {!tokenCMSplit[3] && (
          <input
            id="vrfInput"
            placeholder="Doğrulama kodu"
            maxLength="6"
            type="text"
            autocomplete="off"
            onChange={(e) => {
              setVerificationCode(e.target.value);
            }}
          />
        )}
        {!tokenCMSplit[3] && (
          <a
            id="vrfButton"
            href="javascript:;"
            onClick={(e) => {
              if (
                timeCheckPoint == 0 ||
                Date.now() / 1000 -
                  (timeCheckPoint ? timeCheckPoint : 1) / 1000 >=
                  5
              ) {
                setTimeCheckPoint(Date.now());
                axios
                  .post(config.getApiUrl("users"), 
                  config.generateEncryptedHeader({0: "hhhv", 1: tokenCMSplit[1], 5: verificationCode, 15: localStorage.getItem("token")}))
                  .then(async (resp) => {
                    if (resp.data == true) {
                      setTimeout(()=>{
                        history.push("/login");
                      }, 1000);
                      setTokenCMSplit(
                        Object.assign({}, tokenCMSplit, { 3: true })
                      );
                      toast.success("E-Posta adresiniz doğrulandı! Lütfen tekrar giriş yapın.");
                    } else {
                      toast.error(
                        "Geçersiz doğrulama kodu girildi! Lütfen 5sn sonra tekrar deneyiniz."
                      );
                    }
                  })
                  .catch((e) => {});
              } else {
                toast.warning(
                  `Tekrar denemeden önce ${parseInt(
                    5 -
                      (Date.now() / 1000 -
                        (timeCheckPoint ? timeCheckPoint : 1) / 1000)
                  )}sn bekleyiniz.`
                );
              }
            }}
          >
            Doğrula
          </a>
        )}
        <h3 id="passwordTitle">Şifre</h3>
          <input
            value={password.old}
            type="password"
            placeholder="Eski şifreniz"
            title="Eski şifreniz"
            minLength="6"
            onChange={(e) => {
              setPassword(Object.assign({}, password, { old: e.target.value }));
            }}
          />
          <input
          value={password.new}
            type="password"
            placeholder="Yeni şifreniz"
            title="Yeni şifreniz"
            minLength="6"
            onChange={(e) => {
              setPassword(Object.assign({}, password, { new: e.target.value }));
            }}
          />
        <a
          id="updButton"
          href="javascript:;"
          onClick={(e) => {
            if (password.old.length < 1 || password.new.length < 1){
              toast.error("Lütfen gerekli alanları doldurunuz!")
              return;
            }
            if (password.new.length < 8) {
              toast.error("Yeni şifreniz 6 ila 64 karakter arasında olmalıdır!");
              return;
            };
            axios.post(config.getApiUrl("users"), {username: tokenCMSplit[1], email: tokenCMSplit[2], password: config.crypt(password.old, 53), passwordNew: config.crypt(password.new, 53), rtype: "hhhcp", x: Date.now()}).then(resp => {
              if (resp.data.toString().indexOf("timeout")>-1){
                toast.warning(`Şifrenizi tekrardan değiştirmek için ${resp.data.toString().split("::")[1]/60}dk bekleyiniz!`);
              } else if (resp.data==true){
                setTimeout(()=>{
                  history.push("/login");
                },1000)
                localStorage.removeItem("token");
                toast.success("Şifreniz başarıyla değiştirildi! Lütfen tekrar giriş yapın.");
              } else if (resp.data == "passwordsUnmatch") {
                setPassword(Object.assign({}, {old: ""}));
                toast.warning("Şifreniz doğru değil! Lütfen tekrar deneyiniz.");
              } else if (resp.data == "passwordsSame") {
                setPassword(Object.assign({}, {new: ""}))
              };
            }).catch(e=>{});
          }}
        >
          Kaydet
        </a>
      </div>
    ),
    1: (<div className="page2">
        <div className="picker">
          <div>
            <h3>Satın alımlar:</h3>
          </div>
          <div id="d_">
            <a id={timeInterval==3?"t":"_"} href="javascript:;" onClick={() => {setTimeInterval(3)}}>Son 3 Ay</a>
            <a id={timeInterval==6?"t":"_"} href="javascript:;" onClick={() => {setTimeInterval(6)}}>Son 6 Ay</a>
            <a id={timeInterval==12?"t":"_"} href="javascript:;" onClick={() => {setTimeInterval(12)}}>Son 12 Ay</a>
          </div>
          <div className="list">
            {config.purchasesFilterDate(purchases, timeInterval).length<1 ? (<h4>Geçmiş satın alım bulunamadı.</h4>)
            : config.purchasesFilterDate(purchases, timeInterval).map((val, key) => {
                return (<div className="prchd">
                  <a id="title-prchd">{purchases[key].title}</a>
                  <div className="top-prchd">
                    <a id="date-prchd1">Tarih:</a><a id="description-prchd2">{config.parseMysqlDate(purchases[key].createdAt)}</a>
                    <a id="price-prchd1">Fiyat:</a><a id="price-prchd2">{purchases[key].price}TL</a>
                    <a id="seller-prchd1">Satıcı:</a><a id="seller-prchd2">{purchases[key].sellerID}</a>
                  </div>
                  <div id="line-prchd"></div>
                  <a id="description-prchd">{purchases[key].description}</a>
                </div>)
              })
            }
          </div>
      </div>
      
    </div>),
    2: (<div className="page3">
      <div className="picker">
        <h3>Destek taleplerim:</h3>
        <a id="createNew" href="/support">+ Yeni destek talebi oluştur</a>
      </div>
      <div className="list">
        {supportTickets.length<1 ? (<h4>Geçmiş destek talebi bulunamadı.</h4>)
        : supportTickets.map((value, index) => {
          var decrypted = {
            title: config.aes.decrypt(supportTickets[index].title, "supportTicketTitle"),
            status: config.aes.decrypt(supportTickets[index].status, "supportTicketStatus")
          };
          return (<div className="ticket">
            <div className="top-ticket">
              <a id="title-ticket">{decrypted.title}</a>
            </div>
            <div className="bottom-ticket">
              <a id="date-ticket1">Tarih:</a><a id="date-ticket2">{config.parseMysqlDate(supportTickets[index].updatedAt)}</a>
              <a id="status-ticket1">Durum:</a><a className="status-ticket2" id={decrypted.status=="open" ? "open" : decrypted.status=="replied" ? "replied" : "closed"}>{decrypted.status=="open" ? "Açık" : "Kapalı"}</a>
            </div>
            <div id="line-prchd"></div>
            <div className="bottom2-ticket">
              <a id="goto" href={`/support/${supportTickets[index].ticketID}/${supportTickets[index].accessCode}`}>Yanıtı görüntüle</a>
            </div>
          </div>)
        })}
        
      </div>
    </div>),
  };
  useEffect(async () => {
    await config.checkToken().then((e) => {
      setTokenCheckMessage(config.tokenDecrypt(e));
      console.log(tokenCheckMessage, "91110");
      console.log(tokenCMSplit, "0915");
    });
    axios.post(config.getApiUrl("verificationIndex"), config.generateEncryptedHeader({0: "getSecureCode", 1: config.tokenDecrypt(localStorage.getItem("token")).split("::")[1]})).then(response => {
      setSecureCode(response.data);
      console.log(config.generateEncryptedHeader({1: config.tokenDecrypt(localStorage.getItem("token")).split("::")[1]}))
      console.log(response.data, 7555555132);
    });
    axios.post(config.getApiUrl("users"), config.generateEncryptedHeader({0: "getSupportTickets", 2: config.tokenDecrypt(localStorage.getItem("token")).split("::")[2]})).then((response) => {
      setSupportTickets(response.data);
      console.log(response.data, 66315555132);
    });
    setIsLoaded(true);
  }, []);
  useEffect(async () => {
    console.log(tokenCheckMessage);
    setTokenCMSplit(
      Object.assign(
        {},
        {
          0: tokenCheckMessage.toString().split("::")[0],
          1: tokenCheckMessage.toString().split("::")[1],
          2: tokenCheckMessage.toString().split("::")[2],
          3: tokenCheckMessage.toString().split("::")[3],
        },
        {
          3:
            tokenCheckMessage.toString().split("::")[3] == "true"
              ? true
              : false,
        }
      )
    );
    console.log(parseInt(Date.now()/15000).toString(), 1999999);
    if (isLoaded) {
      if (!tokenCheckMessage) {
        toast.error("Lütfen giriş yapınız!");
        history.push("/login");
      };
      axios.post(config.getApiUrl("purchases"), config.generateEncryptedHeader({0: "getPurchases", 1: config.tokenDecrypt(localStorage.getItem("token")).split("::")[1], 18: timeInterval.toString(), 19: await axios.post(config.getApiUrl("verificationIndex"), config.generateEncryptedHeader({0: "getSecureCode", 1: config.tokenDecrypt(localStorage.getItem("token")).split("::")[1]})).then(response => {return response.data;})})).then(response => {
        setPurchases(response.data);
        console.log(response.data, 56666698);
      });
      setIsLoggedIn(tokenCheckMessage);
    };
  }, [tokenCheckMessage, isLoaded]);
  useEffect(() => {
    console.log(secureCode, 19999901333);
  }, [secureCode]);
  return isLoaded ? (
    <div className="profile">
      {showLogoutWindow && (
        <div className="logout" style={{ display: "grid" }}>
        <h3>
          Çıkış yapmak üzeresiniz..{" "}
          <a
            style={{
              marginLeft: "16.7%",
              marginTop: "-10px",
              position: "absolute",
              textDecoration: "none",
              backgroundColor: "brown",
              width: "15px",
              height: "15px",
              boxShadow: "0px 0px 15px 0px brown",
              borderRadius: "5px",
            }}
            href="javascript:;"
            onClick={() => {
              setShowLogoutWindow(!showLogoutWindow);
            }}
          >
          </a>
        </h3>
        <h1>
          Devam etmek için{" "}
          <a
            onClick={() => {
              localStorage.removeItem("token");
              console.log(history);
              toast.warning("Başarıyla çıkış yapıldı!");
              setShowLogoutWindow(false);
              window.location.reload();
            }}
            href="javascript:;"
          >
            tıkla
          </a>
        </h1>
      </div>
      )}
      <nav className="menu">
        <a href="/offers" id="home">
          Kullanıcı İlanları
        </a>
        <a href="/">
          <img id="dr" src={images["creeper.png"].default} />
        </a>
        <a href="/">
          <img
            id="border"
            src={images["border.png"].default}
            style={{ transition: "rotate(-45deg)", transitionDuration: "1s" }}
            onMouseLeave={() => {}}
          />
        </a>
        {!isLoggedIn ? (
          <a href="/login" id="login">
            Giriş Yap
          </a>
        ) : (
          <a
            href="javascript:;"
            id="logout"
            onClick={() => {
              setShowLogoutWindow(!showLogoutWindow);
            }}
          >
            Çıkış Yap
          </a>
        )}
        {!isLoggedIn ? (
          <a href="/signup" id="signup">
            Kayıt Ol
          </a>
        ) : (
          <a href="/profile" id="profile">
            Hesabım
          </a>
        )}
      </nav>
      <div
        style={configComponents.exceptLogoutStyle[showLogoutWindow ? "u" : "v"]}
      >
        {configComponents.section({ height: "98vh" })}
        {configComponents.setpwd([["/profile", "Hesabım"]])}
        <div className="main">
          <div className="sidebar">
            <img src={images["avatar.png"].default} id="avatar" />
            <a id="t00">{tokenCMSplit[2]}</a>
            <div>
<a
  id="t0"
  style={{
    backgroundColor: menu == 0 ? "rgba(255, 255, 0, 0.438) " : "transparent",
    borderRadius: "10px",
  }}
  href="javascript:;"
  onClick={(e) => {
    setMenu(0);
  }}
>
  Ayarlar
</a>
<a
  id="t1"
  style={{
    backgroundColor: menu == 1 ? "rgba(255, 255, 0, 0.438)" : "transparent",
    borderRadius: "10px",
  }}
  href="javascript:;"
  onClick={(e) => {
    setMenu(1);
  }}
>
  Satın alımlar
</a>
<a
  id="t2"
  style={{
    backgroundColor: menu == 2 ? "rgba(255, 255, 0, 0.438)" : "transparent",
    color: menu == 2 ? "#000" : "yellowgreen",
    borderRadius: "10px",
  }}
  href="javascript:;"
  onClick={(e) => {
    setMenu(2);
  }}
>
  Destek
</a>
<a
  id="t3"
  style={{
    backgroundColor: menu == 3 ? "#acacac" : "transparent",
    color: "red",
    borderRadius: "10px",
  }}
  href="javascript:;"
  onClick={(e) => {
    setShowLogoutWindow(!showLogoutWindow);
  }}
>
  Çıkış yap
</a>
            </div>
          </div>
          <div className="mainmenu">{menuRoutes[menu]}</div>
        </div>
      </div>
    </div>
  ) : (
    configComponents.loading
  );
};

const PersonPage = ({ match }) => {
  let history = useHistory();
  const itemId = match.params.itemId;
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenCheckMessage, setTokenCheckMessage] = useState(false);
  const [showLogoutWindow, setShowLogoutWindow] = useState(false);
  const [faqView, setFaqView] = useState({});
  const [data, setData] = useState([]);
  const [faq, setFaq] = useState([]);
  useEffect(async () => {
    await config.checkToken().then((e) => {
      setTokenCheckMessage(config.tokenDecrypt(e));
    });
    await axios.post(config.getApiUrl("stocks"), config.generateEncryptedHeader({0: "getStocks"})).then((response) => {
      setData(response.data);
      console.log(response.data,999991234)
    });
    console.log(43727777321);
    await axios.post(config.getApiUrl("stocks"), config.generateEncryptedHeader({0: "getFaqs", 10: itemId})).then((response) => {
      setFaq(response.data);
      console.log(response.data, 43727777321);
    });
  }, []);
  useEffect(async () => {
    console.log(tokenCheckMessage, "313131");
    if (tokenCheckMessage == "ipNotMatch") {
      toast.error("Giriş doğrulanamadı! Lütfen tekrar giriş yapın.");
      return;
    }
    setIsLoggedIn(tokenCheckMessage);
    setIsLoaded(true);
  }, [tokenCheckMessage]);
  return isLoaded ? (
    <div>
      {showLogoutWindow && (
        <div className="logout" style={{ display: "grid" }}>
          <h3>
            Çıkış yapmak üzeresiniz..{" "}
            <a
              style={{
                marginLeft: "16.7%",
                marginTop: "-10px",
                position: "absolute",
                textDecoration: "none",
                backgroundColor: "brown",
                width: "15px",
                height: "15px",
                boxShadow: "0px 0px 15px 0px brown",
                borderRadius: "5px",
              }}
              href="javascript:;"
              onClick={() => {
                setShowLogoutWindow(!showLogoutWindow);
              }}
            >
              {/*&#x2716;*/}
            </a>
          </h3>
          <h1>
            Devam etmek için{" "}
            <a
              onClick={() => {
                localStorage.removeItem("token");
                toast.warning("Başarıyla çıkış yapıldı!");
                setShowLogoutWindow(false);
                window.location.reload();
              }}
              href="javascript:;"
            >
              tıkla
            </a>
          </h1>
        </div>
      )}
      <nav className="menu">
        <a href="/offers" id="home">
          Kullanıcı İlanları
        </a>
        <a href="/">
          <img id="dr" src={images["creeper.png"].default} />
        </a>
        <a href="/">
          <img
            id="border"
            src={images["border.png"].default}
            style={{ transition: "rotate(-45deg)", transitionDuration: "1s" }}
            onMouseLeave={() => {}}
          />
        </a>
        {!isLoggedIn ? (
          <a href="/login" id="login">
            Giriş Yap
          </a>
        ) : (
          <a
            href="javascript:;"
            id="logout"
            onClick={() => {
              setShowLogoutWindow(!showLogoutWindow);
            }}
          >
            Çıkış Yap
          </a>
        )}
        {!isLoggedIn ? (
          <a href="/signup" id="signup">
            Kayıt Ol
          </a>
        ) : (
          <a href="/profile" id="profile">
            Hesabım
          </a>
        )}
      </nav>
      <div
        style={configComponents.exceptLogoutStyle[showLogoutWindow ? "u" : "v"]}
      >
        {configComponents.section({ height: "104vh" })}
        {data.map((value, index) => {
          return value.itemId==itemId?(
            <div>
              {configComponents.setpwd([
                ["/", "Ürünler"],
                [
                  `/i/${value.itemId}`,
                  value.title.split("-0-").length > 1
                    ? value.title.split("-0-")[0] +
                      " " +
                      value.title.split("-0-")[1] +
                      " " +
                      value.title.split("-0-")[3]
                    : value.title,
                ],
              ])}
            <div className="insp">
              <div className="main">
                <div id="bar">
                  <a id="title">
                    {value.title.split("-0-").length > 1 ? (
                      <a id="title">
                        {value.title.split("-0-")[0]}
                        <a
                          id="ca"
                          style={{ color: value.title.split("-0-")[2] }}
                          href="javascript:;"
                          title={(function x() {
                            var out = "";
                            value.description &&
                            value.description
                                .split("|||")
                                .map((row) => {
                                  out += "- " + row + "\n";
                                });
                            return out;
                          })()}
                        >
                          {value.title.split("-0-")[1]}
                        </a>
                        {value.title.split("-0-")[3]}
                      </a>
                    ) : (
                      value.title
                    )}
                  </a>
                  <img
                    id="itemPict"
                    src={
                      imagePreviews[value.itemId + ".png"] != null
                        ? imagePreviews[value.itemId + ".png"].default
                        : "."
                    }
                  />
                  <div className="pricedis">
                    <a id="discountPercent">
                      {value.priceDiscount}TL
                      {/*((value.price / value.priceDiscount) * -100*).toString() + "%" */}
                    </a>
                    <a id="base">{value.price}TL</a>
                  </div>
                    <a
                      id="purchase"
                      href="javascript:;"
                      onClick={() => {
                        console.log("sa");
                      }}
                    >
                      Satın Al
                    </a>
                </div>
                <div id="frame">
                  <div id="title">
                    <a>Bilgilendirme</a>
                    <div id="t1"></div>
                    <div id="t2"></div>
                  </div>
                  <div id="description">
                    {value.descriptionlong &&
                      value.descriptionlong
                        .split("|||")
                        .map((row, index) => {
                          return (
                            <a
                              id={
                                index % 2 == 0 || index == 0 ? "c" : "n"
                              }
                            >
                              - {row}
                            </a>
                          );
                        })}
                  </div>
                </div>
              </div>
              <div id="frame2">
                <a id="title">Sık Sorulan Sorular</a>
                <div className="list">
                  {faq.map((value, index) => {
                    return (
                      <div className="faqs">
                        <a id={index==0 || index%2==0 ? "t0":"t1"} onClick ={() => {/*setFaqView(Object.assign({}, faqView, {[index]: (faqView[index]?false:true)}))*/}}>
                          <div>
                            <a id="title">{value.title}</a>
                            <a id="description" style={{/*display: faqView[index]?"block":"none"*/}}>{value.description}</a>
                          </div>
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          ):""
        })
        }

        {configComponents.footer}
      </div>
    </div>
  ) : (
    configComponents.loading
  );
};
const Support = ({ match }) => {
  let history = useHistory();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const ticketID = match.params.ticketID;
  const accessCode = match.params.accessCode;
  const username = config.tokenDecrypt(localStorage.getItem("token")).split("::")[1];
  const email = config.tokenDecrypt(localStorage.getItem("token")).split("::")[2];
  const [ticketMessages, setTicketMessages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [textLength, setTextLength] = useState({title: 0, email: 0, description: 0, messageToSend: 0});
  const [text, setText] = useState({title: "", email: "", description: "", messageToSend: ""});
  const [tokenCheckMessage, setTokenCheckMessage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sendMessageCache, setSendMessageCache] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [lastMessageHasSent, setLastMessageHasSent] = useState(0);
  const [lastMessageTime, setLastMessageTime] = useState(Date.now()/1000);
  const [showLogoutWindow, setShowLogoutWindow] = useState(false);
  const [ticketInfo, setTicketInfo] = useState({});
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(async() => {
    if (ticketID && !accessCode) {
      history.push("/");
      toast.error("Doğrulama başarısız!");
    };
  });
  useEffect(async () => {
    await config.checkToken().then((e) => {
      setTokenCheckMessage(config.tokenDecrypt(e));
    });
    if (ticketID) {
      axios.post(config.getApiUrl("users"), config.generateEncryptedHeader({0: "getSupportTickets", 2: email, 10: ticketID})).then(response => {
        try {
          setTicketInfo(response.data[0]);
        } catch (e) {};
      });
    };
    axios.post(config.getApiUrl("users"), config.generateEncryptedHeader({0: "getSupportMessages", 1: username, 2: email, 5: (await axios.post(config.getApiUrl("verificationIndex"), config.generateEncryptedHeader({0: "getSecureCode", 1: username})).then(response => {return response.data;})), 9: accessCode, 10: ticketID})).then(response => {
      var responseData = response.data;
      if (typeof(responseData)==typeof([])) {
        setTicketMessages(responseData);
      } else {
        responseData = config.aes.decrypt(responseData, "vars");
        if (accessCode && responseData=="auth_failed") {
          history.push("/");
          toast.error("Doğrulama başarısız");
        };
      };
    });
  }, []);
  useEffect(()=>{
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticketMessages])
  useEffect(async () => {
    console.log(tokenCheckMessage, "313131");
    if (tokenCheckMessage == "ipNotMatch") {
      localStorage.removeItem("token");
      toast.error("Giriş doğrulanamadı! Lütfen tekrar giriş yapın.");
      return;
    };
    setIsLoggedIn(tokenCheckMessage);
    setIsLoaded(true);
  }, [tokenCheckMessage]);
  useEffect(async()=>{
    if (sendMessageCache) {
      setSendMessageCache(false);
      if (textLength.messageToSend>0) {
        console.log(Date.now()/1000 - lastMessageTime, 374377772311);
        if (Date.now()/1000 - lastMessageTime < 5) {
          toast.error("Çok hızlı mesaj gönderiyorsun!");
          return;
        };
        setLastMessageTime(Date.now()/1000);
        console.log(Object.assign([], ticketMessages, [{messageSender: config.aes.encrypt(email, "supportTicketMessageSender"), sentMessage: config.aes.encrypt(text.messageToSend, "supportTicketMessage")}]), 93248248238888);
        setTicketMessages(Object.assign([], ticketMessages, [{messageSender: config.aes.encrypt(email, "supportTicketMessageSender"), sentMessage: config.aes.encrypt(text.messageToSend, "supportTicketMessage")}]));
        axios.post(config.getApiUrl("users"), config.generateEncryptedHeader({0: "postSupportMessage", 2: email, 5: await axios.post(config.getApiUrl("verificationIndex"), config.generateEncryptedHeader({0: "getSecureCode", 1: username})).then(response => {return response.data;}), 9: accessCode, 10: ticketID, 11: text.messageToSend})).then(async response=>{
          var responseData = response.data;
          if (responseData == true) {
          axios.post(config.getApiUrl("users"), config.generateEncryptedHeader({0: "getSupportMessages", 1: username, 2: email, 5: (await axios.post(config.getApiUrl("verificationIndex"), config.generateEncryptedHeader({0: "getSecureCode", 1: username})).then(response => {return response.data;})), 9: accessCode, 10: ticketID})).then(response => {
            var responseData2 = response.data;
            if (typeof(responseData2)==typeof([])) {
              setTicketMessages(responseData2);
              inputRef.current.value = "";setTextLength(Object.assign({}, textLength, {messageToSend: 0}));setText(Object.assign({}, text, {messageToSend: ""}))
              scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            } else {
              responseData2 = config.aes.decrypt(responseData2, "vars");
            };
          });
            setLastMessageHasSent(1);
          } else if (responseData == false) {
            setLastMessageHasSent(-1);
          } else {
            setLastMessageHasSent(0);
          };
        });
      };
    };
  }, [sendMessageCache])
  useEventListener("keydown", ({key})=>{key=="Escape" && setShowLogoutWindow(false);});
  return isLoaded?(<div className="support">
    {showLogoutWindow && (
      <div className="logout" style={{ display: "grid" }}>
      <h3>
        Çıkış yapmak üzeresiniz..{" "}
        <a
          style={{
            marginLeft: "16.7%",
            marginTop: "-10px",
            position: "absolute",
            textDecoration: "none",
            backgroundColor: "brown",
            width: "15px",
            height: "15px",
            boxShadow: "0px 0px 15px 0px brown",
            borderRadius: "5px",
          }}
          href="javascript:;"
          onClick={() => {
            setShowLogoutWindow(!showLogoutWindow);
          }}
        >
        </a>
      </h3>
      <h1>
        Devam etmek için{" "}
        <a
          onClick={() => {
            localStorage.removeItem("token");
            console.log(history);
            toast.warning("Başarıyla çıkış yapıldı!");
            setShowLogoutWindow(false);
            window.location.reload();
          }}
          href="javascript:;"
        >
          tıkla
        </a>
      </h1>
    </div>
    )}
    {!ticketID?(
      <div>
      {configComponents.setpwd([["/support", "Destek"]])}
      <div className="main">
        <a id="title-top">Yeni Destek Talebi Oluştur</a>
        <div id="input" className="area">
          <div>
            <a className="AACxE0001" id="title-text">Konu</a>
            <input type="text" maxLength="50" onChange={(e)=>{setTextLength(Object.assign({}, textLength, {title: e.target.value.length}));setText(Object.assign({}, text, {title: e.target.value}))}}/>
            <a id="remaining">{50-textLength.title}</a>
          </div>
          <div>
            <a className="AACxE0001" id="email-text">E-Posta</a>
            <input type="email" maxLength="50" onChange={(e) => {setTextLength(Object.assign({}, textLength, {email: e.target.value.length}));setText(Object.assign({}, text, {email: e.target.value}))}}/>
            <a id="remaining">{50-textLength.email}</a>
          </div>
        </div>
        <div id="description" className="area">
          <a className="AACxE0001" id="title-description">Açıklama</a>
          <textarea type="text" maxLength="250" onChange={(e)=>{setTextLength(Object.assign({}, textLength, {description: e.target.value.length}));setText(Object.assign({}, text, {description: e.target.value}))}}/>
          <a id="remaining">{250-textLength.description}</a>
        </div>
        <a id="send" onClick={() => {
          if (!EmailValidator.validate(text.email)) {
            toast.warning("Lütfen geçerli bir e-posta giriniz!");
            return;
          } else {
            if (textLength.title > 50 || textLength.description > 250 || textLength.email > 250) {
              toast.error("Maksimum uzunluk aşıldı! Lütfen başlığı veya açıklamayı kontrol ediniz.");
              return;
            } else if (textLength.title < 1 || textLength.description < 1 || textLength.email < 1) {
              toast.error("Lütfen gerekli alanları boş bırakmayınız!");
              return;
            } else {
              axios.post(config.getApiUrl("users"), config.generateEncryptedHeader({0: "postSupportTicket", 2: email, 12: text.email, 13: text.title, 14: text.description})).then((response) => {
                if (response.data!=false) {
                  var temp = config.aes.decrypt(response.data, "vars").split("::");
                  toast.success("Başarıyla destek talebiniz gönderildi! Cevaplanması 24 saate kadar sürebilir.");
                  history.push(`/support/${temp[0]}/${temp[1]}`);
                }else {
                  toast.error("Bir hata ile karşılaştık! Lütfen daha sonra tekrar deneyiniz.");
                };
              }).catch((error) => {toast.error("Sunucu ile ilgili bir hatayla karşılaştık! Lütfen daha sonra tekrar deneyiniz.")});
            };
          };
        }} href="javascript:;">Destek talebini gönder</a>
      </div>
    </div>):(
      console.log(ticketID, 34543111122),
      <div className="ticketMessenger">
        <nav className="menu">
        <a href="/offers" id="home">
          Kullanıcı İlanları
        </a>
        <a href="/">
          <img id="dr" src={images["creeper.png"].default} />
        </a>
        <a href="/">
          <img
            id="border"
            src={images["border.png"].default}
            style={{ transition: "rotate(-45deg)", transitionDuration: "1s" }}
            onMouseLeave={() => {}}
          />
        </a>
        {!isLoggedIn ? (
          <a href="/login" id="login">
            Giriş Yap
          </a>
        ) : (
          <a
            href="javascript:;"
            id="logout"
            onClick={() => {
              setShowLogoutWindow(!showLogoutWindow);
            }}
          >
            Çıkış Yap
          </a>
        )}
        {!isLoggedIn ? (
          <a href="/signup" id="signup">
            Kayıt Ol
          </a>
        ) : (
          <a href="/profile" id="profile">
            Hesabım
          </a>
        )}
      </nav>
      <div  style={configComponents.exceptLogoutStyle[showLogoutWindow ? "u" : "v"]}>
        {configComponents.setpwd([["/support", "Destek"], [`/support/${ticketID}`, `Destek NO: ${ticketID}`]])}
        <div className="main-support">
          <div className="messenger">
            <a id="title-ticket-messenger">{config.aes.decrypt(ticketInfo.title, "supportTicketTitle")}</a>
            <div className="dd">
              {ticketMessages.map((value, index) => {
                var decrypted = {messageSender: config.aes.decrypt(value.messageSender, "supportTicketMessageSender"), sentMessage: config.aes.decrypt(value.sentMessage, "supportTicketMessage")};
                return (<div id={decrypted.messageSender==email?"outgoing":"incoming"} className="message">
                  <div className="messageBox">
                    <div className="top-messenger"><img id="avatar-messenger" src={avatar}/><a id="messageSender-messenger">{decrypted.messageSender}</a><a id="date-message">{config.parseMysqlDate(value.createdAt)}</a></div>
                    <div><a id="sentMessage">{decrypted.sentMessage}</a></div>
                  </div>
                </div>)
              })}
              <div ref={scrollRef}/>
            </div>
          </div>
          <div className="bottom-messenger">
            <input id="messengerInput" ref={inputRef} maxLength="250" onKeyPress={(e)=>{if(e.key=="Enter"){setSendMessageCache(true);};}} onChange={(e) => {setTextLength(Object.assign({}, textLength, {messageToSend: e.target.value.length}));setText(Object.assign({}, text, {messageToSend: e.target.value}))}}/><a href="javascript:;" onClick={() => {
              setSendMessageCache(true);
            }} id="btn-send">Gönder</a>
          </div>
        </div>
      </div>
      </div>
    )
  }
  </div>):configComponents.loading;
};
function App() {
  /*const [isLoggedIn, setIsLoggedIn] = useState(false);
  let history = useHistory();
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };*/
  useEffect(async () => {}, []);
  return (
    <div>
      {(isDesktop && !(isIE || isLegacyEdge || isMobile)) ? (<div className="App">
        <Router>
          <Route path="/" exact component={Home} />
          <Route path="/i" exact component={() => <Redirect to="/" />} />
          {/*<Route path="/account/" exact component={()=><Redirect to="/account/login"/>}/>*/}
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Login} />
          <Route path="/offers" exact component={Offers} />
          <Route path="/support" exact component={Support}/>
          <Route path="/support/:ticketID" exact component={Support}/>
          <Route path="/support/:ticketID/:accessCode" exact component={Support}/>
          <Route path="/i/:itemId" component={PersonPage} />
          <Route path="/profile" component={Profile} />
        </Router>
      </div>) : (isMobile && !(isIE || isLegacyEdge)) ? (
        <Router>
          
        </Router>
      ) : (isIE || isLegacyEdge) ? (<h3>Unsupported browser detected.</h3>) : (<></>)}
    </div>);
}
export default App;
