import React, { useState,  useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage,  } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
//import "./toastify.css";
import * as Yup from "yup";
import axios from 'axios';
import App from "../App";
import { useHistory, Redirect, useParams, useLocation } from "react-router-dom";
import configComponents from "../configComponents";
const config = require("../config");
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
};
const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));
function Login() {
    //sessionStorage.setItem
    const [showErrors, setShowErros] = useState(false);
    const [publicIP, setPublicIP] = useState(config.getPublicIP());
    const [postData, setPostData] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const { height, width } = useWindowDimensions();
    useEffect(async() => {
        if (localStorage.getItem("token")){
            axios.post("http://localhost:3001/users", {token: localStorage.getItem("token"), tokentest: config.crypt(await publicIP, 7), rtype: "hhht"}).then(resp => {
                console.log(resp, "ssa");
                if(resp.data==true) {
                    console.log("giriş yapılmış");
                    history.push("/");
                    toast.warning("Zaten giriş yapılmış!");
                } else {
                    setIsLoggedIn(false);
                };
            }).catch(e => {history.push("/");toast.error("Sunucu ile ilgili bir sorunla karşılaşıldı!");setIsLoggedIn(false)});
        } else {
            setIsLoggedIn(false);
        };
    }, []);
        

    let history = useHistory();
    var id = history.location.pathname;
    return !isLoggedIn?(
        <div className="login">
            {configComponents.section({height: "90vh"})}
            {configComponents.setpwd([["/login", "Giriş"]])}
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
                    <label id="password">Şifre{id}</label>
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
        </div>
    ):configComponents.loading;
};

export default Login