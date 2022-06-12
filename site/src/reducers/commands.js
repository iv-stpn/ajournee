import { getDate } from "@/utils/chatUtils";
import { addEvent } from "@/utils/eventUtils";

import {setNotificationHandler, scheduleNotificationAsync} from "expo-notifications";


setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default (state = [], action) => {
    switch (action.type) {
        
        case "ADD_COMMAND":
            const evt = addEvent(action.text)
            
            // notifyUser10MinEarlier("Event name TO BE FETCHED", new Date(date) )
            
            if (evt?.start) {
                return [
                    ...state,
                    action.text,
                    `La date ${evt.start.format("llll")} a été entrée`,
                ];
            }
            
            else {
                return [...state, action.text];
            }
        
        case "REMOVE_COMMAND":
            return state.filter((_, idx) => idx !== action.index);

        default:
            return state; 
    }
};

async function schedulePushNotification(title,body,date) {
    await scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: {seconds :  ~~( (Date.now() - new Date(date).getTime()) / 1000) }
    });
}

//notifies user 10 minutes before a given event
export const notifyUser10MinEarlier = (title, date) => {
    schedulePushNotification(title,"commence dans 10 min!", new Date( new Date(date).getTime() - 2*1000 /*10*60*1000*/ ) );
};