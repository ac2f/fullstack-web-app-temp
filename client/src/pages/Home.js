/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState, useRef } from "react";
import { useHistory, Route } from "react-router-dom";
import configComponents from "../configComponents";
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
const imagePreviews = importAll(
  require.context("../images/previews", false, /\.(png|jpe?g|svg)$/)
);
//const previewsFull = importAll(require.context('../images/previews/full', false, /\.(png|jpe?g|svg)$/));
function Home() {
  let history = useHistory();
  const ref = useRef(null);
  const [listOfstocks, setListOfstocks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenCheckMessage, setTokenCheckMessage] = useState(false);
  const [showLogoutWindow, setShowLogoutWindow] = useState(false);
  const [showHotBorderAnimation, setShowHotBorderAnimation] = useState(true);
  useEffect(async () => {
    axios
      .post(config.getApiUrl("stocks"), config.generateEncryptedHeader({0: "getStocks"}))
      .then((response) => {
        setListOfstocks(response.data);
      })
      .catch(() => console.log("error"));
    await config.checkToken().then((e) => {
      setTokenCheckMessage(config.tokenDecrypt(e));
    });
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
    <div className="Home">
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
      <div><a>Tüm ürünlerde %50'ye varan indirim!</a></div>
      </nav>
      <div
        style={configComponents.exceptLogoutStyle[showLogoutWindow ? "u" : "v"]}
      >
        <div className="page">
          {
            configComponents.section({
              height: `${
                listOfstocks.length % 3 != 0
                  ? parseInt(listOfstocks.length / 3) * 114.5
                  : (listOfstocks.length / 3) * 83.5
              }%`,
            }) /*(listOfstocks.length%3==0?(listOfstocks/3)*690:1920)*/
          }
          {configComponents.setpwd()}
          <div id={showHotBorderAnimation?"y":""} className="hot">
            <a onClick={() => {setShowHotBorderAnimation(!showHotBorderAnimation)}} href="javascript:;" id="stopAnimation" title="Animasyonu Durdur/Devam et"></a>
            <a id="a">
              Tüm ürünlerde <a id={showHotBorderAnimation?"y":""}>%50</a>'ye varan indirim!
            </a>
          </div>
          <div className="flexArea" ref={ref}>
            {listOfstocks.map((value, key) => {
              if (
                value.itemId &&
                value.title &&
                value.description &&
                value.price &&
                value.priceDiscount
              ) {
                return (
                  <div className="item">
                    <div className="top">
                        {value.title.split("-0-").length > 1 ? (
                          <a className="title">
                            {value.title.split("-0-")[0]}
                            <a style={{ backgroundImage: `linear-gradient(45deg, ${value.title.split("-0-")[2].split(";")[0]}, ${value.title.split("-0-")[2].split(";")[1]})` }}>
                              {value.title.split("-0-")[1]}
                            </a>
                            {value.title.split("-0-")[3]}
                          </a>
                        ) : (
                          <a id="title">{value.title}</a>
                        )}
                      <div className="price">
                        <a id="base">{value.price}TL</a>
                        <a id="discount">
                          {(value.price / -value.priceDiscount) * 100}%
                        </a>
                      </div>
                    </div>
                    <div className="middle">
                      <img
                        id="image"
                        src={
                          imagePreviews[value.itemId + ".png"] != null
                            ? imagePreviews[value.itemId + ".png"].default
                            : "."
                        }
                      />
                      <ul id="description">
                        {value.description.split("|||").map((row) => {
                          return <li>{row}</li>;
                        })}
                      </ul>
                      <a id="btn" href={"/i/" + value.itemId}>
                        İncele
                      </a>
                    </div>
                  </div>
                );
              }
            })}
            {/*listOfstocks.length>0?listOfstocks.map((value, key) => {
                        
                        return (<div id="st" onMouseEnter={() => {setIsHovered(true);setPreviewID(value.itemId)}} onMouseLeave={() => {setIsHovered(false)}}>
                                    <a id="title">{value.title}</a>
                                    <div id="frame"><img id="itemPict" src={images[value.itemId+".png"]!=null?images[value.itemId+".png"].default:"."}/>
                                    <a id="description">{value.description}</a>
                                    {value.price===value.priceDiscount?<a id="price">{value.price}TL</a>:(<div className="pricedis"><a id="base">{value.price}TL</a><a id="ddd">{value.priceDiscount}TL</a></div>)}
                                    </div>
                            </div>);

            }):<a id="n2s">:/<input maxLength="12" autoFocus={true} type="data-autosize-input" value="Hiçbir şey bulunamadı" id="c"></input><a>_</a></a>*/}
          </div>
          {configComponents.footer}
        </div>
      </div>
    </div>
  ) : (
    configComponents.loading
  );
}

export default Home;
