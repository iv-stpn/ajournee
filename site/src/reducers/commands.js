import { getDate } from "@/utils/chatUtils";

import * as Notifications from "expo-notifications";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default (state = [], action) => {
    switch (action.type) {
        
        case "ADD_COMMAND":
            const date = getDate(action.text);
            command = (action.text).split(" ");

            if ( (action.text).split(" ")[0] === "remind") {

                if( (command === ["remind","","",""]) ){
                    Alert.alert('😮 Oops!', 'Format de la commande : remind [eventName] [date] [time]', [ {text: 'OK'} ]);
                }

                else{
                    eventName = command[1],
                    _date = command[2],
                    time = command[3]

                    schedulePushNotification(eventName,"commence dans 10 min!", 1 /* 10*60 */);
               
                    return [
                        ...state,
                        action.text,
                        `Rappel "${eventName}" créé pour le ${_date} à ${time}.`,
                    ];
                }
            }

            if (date) {
                return [
                    ...state,
                    action.text,
                    `La date ${date.format("llll")} a été entrée`,
                ];
            }

            else {
                return [...state, action.text];
            }

        case "REMOVE_COMMAND":
            return state.filter((_, idx) => idx !== action.index);

        default:
            return state=[]; //temporaire pour clear tout 
    }
};


async function schedulePushNotification(title,body,sec) {
    console.log("IN")
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: { data: "goes here" },
        },
        trigger: { seconds : sec },
    });
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    return token;
}