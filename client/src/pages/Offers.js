/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState, Route } from "react";
import configComponents from "../configComponents";
import { useHistory } from "react-router-dom";
import useEventListener from "@use-it/event-listener";
const config = require("../config");
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}
const images = importAll(
  require.context("../images", false, /\.(png|jpe?g|svg)$/)
);
function Offers() {
  let history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [offers, setOffers] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenCheckMessage, setTokenCheckMessage] = useState(false);
  const [showLogoutWindow, setShowLogoutWindow] = useState(false);
  /*useEffect(async()=>{
        localStorage.getItem("token")&&axios.post("http://localhost:3001/users", {token: localStorage.getItem("token"), tokentest: config.crypt(await publicIP, 7), rtype: "hhht"}).then(resp => {
                setIsLoggedIn(resp.data);
            }).catch((e)=>{
                setIsLoggedIn(false);
            });
            setIsLoaded(true);
            
        }, [])*/
  useEffect(async () => {
    await config.checkToken().then((e) => {
      setTokenCheckMessage(config.tokenDecrypt(e));
    });
    setOffers(
      await axios
        .post(config.getApiUrl("offers"), { rtype: "test" })
        .then((e) => {
          return e;
        })
    );
    setIsLoaded(true);
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
  useEventListener("keydown", ({key})=>{key=="Escape" && setShowLogoutWindow(false);});
  return isLoaded ? (
    <div className="offers">
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
      <nav class="menu">
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
        {configComponents.setpwd([["/offers", "Kullanıcı ilanları"]])}
        {!offers.length ? (
          <a id="n2s">
            :/
            <input
              maxLength="12"
              autoFocus={true}
              type="data-autosize-input"
              value="Hiçbir şey bulunamadı"
              id="c"
            ></input>
            <a>_</a>
          </a>
        ) : (
          <div className="e"></div>
        )}
      </div>
    </div>
  ) : (
    <div className="loading">
      <div id="o"></div>
      <a>Yükleniyor..</a>
    </div>
  );
}
export default Offers;
