import React from 'react'
import axios from "axios";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import configComponents from "../configComponents";
import useEventListener from "@use-it/event-listener";
const config = require("../config");

function Items({item}) {
  //useEventListener("keydown", ({key})=>{key=="Escape" && setShowLogoutWindow(false);});
  return (
        <div className="Items">
            
            {configComponents.footer}
        </div>
    );
};
export default withRouter(Items);