/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage,  } from "formik";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 
//import "./toastify.css";
import * as Yup from "yup";
import axios from 'axios';
import { useHistory, withRouter } from "react-router-dom";
import configComponents from "../configComponents";
const config = require("../config");
function Signup (){
    var initialValues = {"username":"","email":"","password":"","passwordR":""};
    const [showErrors, setShowErros] = useState(false);
    const [postData, setPostData] = useState(true);
    const [publicIP, setPublicIP] = useState(config.getPublicIP());
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const { height, width } = useWindowDimensions();
    let history = useHistory();
    useEffect(async() => {
        if (localStorage.getItem("token")){
                console.log(await publicIP, "9993131990");
                axios.post("http://localhost:3001/users", {token: localStorage.getItem("token"), tokentest: config.crypt(await publicIP, 7), rtype: "hhht"}).then((response) => {
                    if(response.data==true || response.data=="true"){
                        history.push("/")
                        toast.warning("Zaten giriş yapılmış!")
                    }else {
                        setIsLoggedIn(false);
                    };
                }).catch(e => {history.push("/");toast.error("Sunucu ile ilgili bir sorunla karşılaşıldı!");setIsLoggedIn(false)});
        } else {
            setIsLoggedIn(false);
        };
    }, [])
    return !isLoggedIn?(
        <div className="signup">
            {configComponents.section({height: "98vh"})}
            {configComponents.setpwd([["/signup", "Kayıt"]])}
            {/*<div className="pwd"><a href="/">Ana Sayfa </a><a href="/signup">/ Kayıt</a></div>            */}
            <Formik
            initialValues={initialValues} 
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
            {configComponents.footer}
        </div>
    ):configComponents.loading;
};

export default Signup