import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import "./toastify.css";
import * as Yup from "yup";
import axios from "axios";
import App from "../App";
import { useHistory, Redirect, useParams, useLocation } from "react-router-dom";
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
function Login() {
  //sessionStorage.setItem
  let history = useHistory();
  var id = history.location.pathname;
  const [showErrors, setShowErros] = useState(false);
  const [publicIP, setPublicIP] = useState(config.getPublicIP());
  const [postDataSignup, setPostDataSignup] = useState(true);
  const [postDataLogin, setPostDataLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tokenCheckMessage, setTokenCheckMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(
    id == "/signup" ? true : false
  );
  useEffect(async () => {
    if (localStorage.getItem("token")) {
      await config.checkToken().then((e) => {
        setTokenCheckMessage(config.tokenDecrypt(e));
      });
      /*axios.post("http://localhost:3001/users", {token: localStorage.getItem("token"), tokentest: config.crypt(await publicIP, 7), rtype: "hhht"}).then(resp => {
                console.log(resp, "ssa");
                if(resp.data==true) {
                    console.log("giriş yapılmış");
                    history.push("/");
                    toast.warning("Zaten giriş yapılmış!");
                } else {
                    setIsLoggedIn(false);
                };
            }).catch(e => {history.push("/");toast.error("Sunucu ile ilgili bir sorunla karşılaşıldı!");setIsLoggedIn(false)});*/
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  useEffect(() => {
    console.log(tokenCheckMessage, 77741992)
    if (tokenCheckMessage) {
      history.push("/");
      toast.warning("Zaten giriş yapılmış!");
      setIsLoggedIn(true);
      return;
    };
    setIsLoggedIn(false);
    setIsLoaded(true);
  }, [tokenCheckMessage]);
  return isLoaded ? (
    <div className="login">
      {/*!showSignupForm?(<div className="login">
                {configComponents.section({height: "90vh"})}
                {configComponents.setpwd([["/login", "Giriş"]])}
                <div className="menuSelection">
                    <a id={showSignupForm?"signin":"a"} onClick={()=>{setShowSignupForm(false)}} href="javascript:;">Giriş</a>
                    <a id={!showSignupForm?"signup":"a"} onClick={()=>{setShowSignupForm(true)}} href="javascript:;">Kayıt</a>
                </div>
                <Formik
                initialValues={{"username": "","password": ""}} 
                onSubmit={async(data) => {
                    console.log(31, postData)
                    setShowErros(false);
                    if (postData){
                        data.rtype = "hhh";
                        var password = config.crypt(data.password, 53);
                        console.log(data.password, password, "ip", config.crypt(await publicIP, 7), "data", data);
                        axios.post("http://localhost:3001/users", Object.assign({}, data, {password: password, tokentest: config.crypt(await publicIP, 7)})).then(resp=>{
                        console.log(resp.data, 333);
                        if(resp.data.length>44){
                            setTimeout(()=>{
                                history.push("/");
                            }, 1000);
                            localStorage.setItem("token", resp.data);
                            setPostData(false);
                            toast.success("Giriş başarılı!");
                        };
                        resp.data=="bad_credentials"&&toast.error("Girdiğiniz bilgiler ile eşleşen bir hesap bulunamadı!");
                        });
                    };
                }}
                validationSchema={Yup.object().shape({
                    username: Yup.string().required("Kullanıcı adı veya E-posta girmelisiniz!"),
                    password: Yup.string().required("Şifre girmelisiniz!")
                })}>
                    <Form className="form">
                        <img src={images["avatar.png"].default}/>
                        <label id="username">Kullanıcı adı veya E-posta</label>
                        <Field 
                            autoComplete="on" id={!showErrors?"inputUsername":"inputUsernameErr"} name="username" placeholder=""/>
                        {showErrors?<ErrorMessage name="username" id="errmsg" component="span"/>:null}
                        <label id="password">Şifre</label>
                        <Field 
                            autoComplete="on" id={!showErrors?"inputPassword":"inputPasswordErr"} name="password" placeholder="" type="password"/>
                        {showErrors?<ErrorMessage name="password" id="errmsg" component="span"/>:null}
                        <button type="submit" id="btn" onClick={() => {setShowErros(true)}}>Giriş Yap</button>
                        <div id="bott">
                            <a href="/resetpassword" id="resetpassword">Şifremi unuttum</a>
                            <a href="/signup" id="signup">Yeni hesap oluştur</a>
                        </div>
                    </Form>
                </Formik>
                {configComponents.footer}
            </div>):(
                <div className="signup">
                    {configComponents.section({height: "98vh"})}
                    {configComponents.setpwd([["/signup", "Kayıt"]])}
                    {/*<div className="pwd"><a href="/">Ana Sayfa </a><a href="/signup">/ Kayıt</a></div>            }
                    <div className="main">
                        <div className="menuSelection">
                            <a id={showSignupForm?"signin":"a"} onClick={()=>{setShowSignupForm(false)}} href="javascript:;">Giriş</a>
                            <a id={!showSignupForm?"signup":"a"} onClick={()=>{setShowSignupForm(true)}} href="javascript:;">Kayıt</a>
                        </div>
                        <Formik
                        initialValues={{"username":"","email":"","password":"","passwordR":""}} 
                        onSubmit={async(data) => {
                            setShowErros(false);
                            if (postData) {
                                data.rtype = "rrrr"
                                var password = config.crypt(data.password, 53);
                                console.log(30042)
                                axios.post("http://localhost:3001/users", Object.assign({}, data, {password: password, test: (await publicIP)})).then((resp)=>{
                                    if(resp.data==true){
                                        setTimeout(()=>{
                                            history.push("/login");
                                        }, 1000)
                                        setPostData(false);
                                        toast.success("Kayıt başarılı! Lütfen giriş yapınız");
                                    };
                                    (resp.data=="exist")&&toast.error("Kayıt olmaya çalıştığınız bilgiler zaten kullanılıyor!");
                                    (resp.data.toString().indexOf("cooldown")>-1)&&toast.warning(`Hali hazırda bir hesabınız bulunuyor! Tekrar denemek için ${resp.data.split("_")[1]} ${resp.data.split("_")[2]=="d"?"Gün":resp.data.split("_")[2]=="hr"?"Saat":""}`);
                                }).catch(e=>{
                                        toast.error("Sunucu ile ilgili bir hatayla karşılaştık!");
                                });
                            };
                        }}
                        validationSchema={Yup.object().shape({
                            username: Yup.string().required("Kullanıcı adı girmelisiniz!").min(4, "Kullanıcı adınız en az 4 harf içermelidir!").max(16, "Kullanıcı adınız en fazla 16 harf içermelidir!").matches(/^[A-Za-z0-9]+$/, "Sadece ingilizce karakterler kullanılabilir!"),
                            email: Yup.string().required("E-Posta adresinizi girmelisiniz!").email("Geçerli bir e posta girmelisiniz"),
                            password: Yup.string().required("Şifre girmelisiniz!").min(6, "Şifreniz en az 6 harf içermelidir!").max(64, "Şifreniz en fazla 64 harf içermelidir!"),
                            passwordR: Yup.string().required("Şifrenizi tekrar girmelisiniz!").oneOf([Yup.ref('password'), null], "Şifreleriniz eşleşmiyor!")
                        })}>
                            <Form className="form">
                                <label id="username">Kullanıcı adı</label>
                                <Field 
                                    autoComplete="on" id={!showErrors?"inputUsername":"inputUsernameErr"} name="username" placeholder=""/>
                                {showErrors?<ErrorMessage name="username" id="errmsg" component="span"/>:null}
                                <label id="email">E-posta</label>
                                <Field 
                                    autoComplete="on" id={!showErrors?"inputUsername":"inputUsernameErr"} name="email" placeholder=""/>
                                {showErrors?<ErrorMessage name="email" id="errmsg" component="span"/>:null}
                                <label id="password">Şifre</label>
                                <Field 
                                    autoComplete="on" id={!showErrors?"inputPassword":"inputPasswordErr"} name="password" placeholder="" type="password"/>
                                {showErrors?<ErrorMessage name="password" id="errmsg" component="span"/>:null}
                                <label id="passwordr">Şifre tekrar</label>
                                <Field 
                                    autoComplete="on" id={!showErrors?"inputPasswordR":"inputPasswordErr"} name="passwordR" placeholder="" type="password"/>
                                {showErrors?<ErrorMessage name="passwordR" id="errmsg" component="span"/>:null}
                                <button type="submit" id="btn" onClick={() => {setShowErros(true); setTimeout(()=>{}, 2000)}}>Kayıt ol</button>
                                <div id="bott">
                                    <a href="/login" id="login">Zaten bir hesabın var mı? Giriş Yap</a>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                    {configComponents.footer}
                </div>
                    )*/}
      {/*configComponents.setpwd([showSignupForm?["/signup", "Kayıt ol"]:["/login", "Giriş yap"]])*/}
      <div className="pwdX">
        <a id="ic">&#8962;</a>
        <a href="/">Ana Sayfa <a style={{marginLeft: "-1vh", marginRight: "4vh"}}>/</a></a>
        <div id={showSignupForm ? "div2" : "div1"}>
          <a
            href="javascript:;"
            onClick={() => {setShowSignupForm(false)}}
            style={{ color: showSignupForm ? "white" : "gray" }}
          >
            Kayıt
          </a>
          <a
            href="javascript:;"
            onClick={() => {setShowSignupForm(true)}}
            style={{ color: !showSignupForm ? "white" : "gray" }}
          >
            Giriş
          </a>
        </div>
      </div>
      <div
        className={
          showSignupForm ? "container right-panel-active" : "container"
        }
        id="container"
      >
        <div className="form-container sign-up-container">
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
              passwordR: "",
            }}
            onSubmit={async (data) => {
                setIsLoading(true);
              setShowErros(false);
              if (postDataSignup && isLoaded && !isLoggedIn) {
                data.rtype = "rrrr";
                var password = config.crypt(data.password, 53);
                console.log(30042);
                
                axios
                  .post(
                    config.getApiUrl("users"),
                    config.generateEncryptedHeader({0: "rrrr", 1: data.username, 2: data.email, 3: data.password, 4: data.passwordR, 17: config.crypt(await config.getPublicIP(), 7)}))
                  .then((resp) => {
                    console.log(resp);
                    if (resp.data == true) {
                      setTimeout(() => {
                        history.push("/login");
                        setShowSignupForm(false);
                      }, 1000);
                      setPostDataSignup(false);
                      toast.success("Kayıt başarılı! Lütfen giriş yapınız");
                    }
                    resp.data == "exist" &&
                      toast.error(
                        "Kayıt olmaya çalıştığınız bilgiler zaten kullanılıyor!"
                      );
                    resp.data.toString().indexOf("cooldown") > -1 &&
                      toast.warning(
                        `Hali hazırda bir hesabınız bulunuyor! Tekrar denemek için ${
                          resp.data.split("_")[1]
                        } ${
                          resp.data.split("_")[2] == "d"
                            ? "Gün"
                            : resp.data.split("_")[2] == "hr"
                            ? "Saat"
                            : ""
                        }`
                      );
                  })
                  .catch((e) => {
                    console.log(e);
                    toast.error(
                      `Sunucu ile ilgili bir hatayla karşılaştık! Hata mesajı: \"${
                        e.toString().split(":")[0]
                      }\"`
                    );
                  });
                  setPostDataSignup(true);
                };
            setIsLoading(false);
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()
                .required("Kullanıcı adı girmelisiniz!")
                .min(4, "Kullanıcı adınız en az 4 harf içermelidir!")
                .max(16, "Kullanıcı adınız en fazla 16 harf içermelidir!")
                .matches(
                  /^[A-Za-z0-9]+$/,
                  "Sadece ingilizce karakterler kullanılabilir!"
                ),
              email: Yup.string()
                .required("E-Posta adresinizi girmelisiniz!")
                .email("Geçerli bir e posta girmelisiniz"),
              password: Yup.string()
                .required("Şifre girmelisiniz!")
                .min(6, "Şifreniz en az 6 harf içermelidir!")
                .max(64, "Şifreniz en fazla 64 harf içermelidir!"),
              passwordR: Yup.string()
                .required("Şifrenizi tekrar girmelisiniz!")
                .oneOf([Yup.ref("password"), null], "Şifreleriniz eşleşmiyor!"),
            })}
          >
            <Form className="form">
              <h1>Kayıt ol</h1>
              <Field
                autoComplete="on"
                id={!showErrors ? "inputUsername" : "inputUsernameErr"}
                name="username"
                placeholder="Kullanıcı adı"
              />
              {showErrors ? (
                <ErrorMessage name="username" id="errmsg" component="span" />
              ) : null}
              <Field
                autoComplete="on"
                id={!showErrors ? "inputUsername" : "inputUsernameErr"}
                name="email"
                placeholder="E-Posta"
              />
              {showErrors ? (
                <ErrorMessage name="email" id="errmsg" component="span" />
              ) : null}
              <Field
                autoComplete="on"
                id={!showErrors ? "inputPassword" : "inputPasswordErr"}
                name="password"
                placeholder="Şifre"
                type="password"
              />
              {showErrors ? (
                <ErrorMessage name="password" id="errmsg" component="span" />
              ) : null}
              <Field
                autoComplete="on"
                id={!showErrors ? "inputPasswordR" : "inputPasswordErr"}
                name="passwordR"
                placeholder="Şifre tekrar"
                type="password"
              />
              {showErrors ? (
                <ErrorMessage name="passwordR" id="errmsg" component="span" />
              ) : null}
              <button
                type="submit"
                id="btn"
                onClick={() => {
                  setShowErros(true);
                  setTimeout(() => {}, 2000);
                }}
              >
                <a>{isLoading?<div class="ldn"><div id="ldn0"></div><div id="ldn1"></div><div id="ldn2"></div></div>:"Kayıt ol"}</a>
              </button>
              <div id={isLoading?"ld":"ld_"}></div>
            </Form>
          </Formik>
        </div>
        <div className="form-container sign-in-container">
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (data) => {
                setIsLoading(true);
              console.log(31, postDataSignup);
              setShowErros(false);
              if (postDataLogin && isLoaded && !isLoggedIn) {
                data.rtype = "hhh";
                var password = config.crypt(data.password, 53);
                console.log(
                  data.password,
                  password,
                  "ip",
                  config.crypt(await publicIP, 7),
                  "data",
                  data
                );
                axios
                  .post(
                    config.getApiUrl("users"), config.generateEncryptedHeader({0: "hhh", 1: data.username, 3: data.password, 17: config.crypt(await config.getPublicIP(), 7)})
                  )
                  .then((resp) => {
                    console.log(resp.data, 333);
                    if (resp.data.length > 44) {
                      setTimeout(() => {
                        history.push("/");
                      }, 1000);
                      localStorage.setItem("token", resp.data);
                      setPostDataLogin(false);
                      toast.success("Giriş başarılı!");
                    }
                    resp.data == "bad_credentials" &&
                      toast.error(
                        "Girdiğiniz bilgiler ile eşleşen bir hesap bulunamadı!"
                      );
                  });
                setPostDataLogin(true);
              }
              setIsLoading(false);
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().required(
                "Kullanıcı adı veya E-posta girmelisiniz!"
              ),
              password: Yup.string().required("Şifre girmelisiniz!"),
            })}
          >
            <Form className="form">
              <h1>Giriş yap</h1>
              <Field
                autoComplete="on"
                id={!showErrors ? "inputUsername" : "inputUsernameErr"}
                name="username"
                placeholder="Kullanıcı adı veya e-posta"
              />
              {showErrors ? (
                <ErrorMessage name="username" id="errmsg" component="span" />
              ) : null}
              <Field
                autoComplete="on"
                id={!showErrors ? "inputPassword" : "inputPasswordErr"}
                name="password"
                placeholder="Şifre"
                type="password"
              />
              {showErrors ? (
                <ErrorMessage name="password" id="errmsg" component="span" />
              ) : null}
              <a href="/resetpassword" id="resetpassword">
                Şifremi unuttum
              </a>
              <button
                type="submit"
                id="btn"
                onClick={() => {
                  setShowErros(true);
                }}
              >
                <a>{isLoading?<div class="ldn"><div id="ldn0"></div><div id="ldn1"></div><div id="ldn2"></div></div>:"Giriş yap"}</a>
              </button>
            </Form>
          </Formik>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Merhaba!</h1>
              <p>Devam edebilmek için kayıt olun</p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => {
                  setShowSignupForm(!showSignupForm);
                }}
              >
                Giriş yap
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Tekrardan merhaba!</h1>
              <p>Devam edebilmek için giriş yapın</p>
              <button
                className="ghost"
                id="signUp"
                onClick={() => {
                  setShowSignupForm(!showSignupForm);
                }}
              >
                Kayıt ol
              </button>
            </div>
          </div>
        </div>
      </div>
      {configComponents.footer}
    </div>
  ) : (
    configComponents.loading
  );
};

export default Login;
