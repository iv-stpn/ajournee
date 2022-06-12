import { store } from "@/reducers";
import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { getDate } from "./chatUtils";

export const addEvent = (text) => {
    const extraTime = 3 * 3600 * 1000 //3h en ms
    
    const date = getDate(text);
    console.log(date)
    const command = (text).split(" ");
    if(command.length > 2)
        if (command[0] === "remind") 
            if(date) {
                const evt = {
                    title : command[1],
                    start : new Date(date),
                    stop : new Date(date + extraTime)
                }
                setTimeout(() => {
                store.dispatch({type : 'STORE_EVENT', events :[evt]})}
                )
                return evt
        }
        
    return null;
}   
