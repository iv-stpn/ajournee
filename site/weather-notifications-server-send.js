export const sendPushNotifications = (pushTokens) =>
    getWeatherData('Barcelona').then((cityData) => {
        const expoPushMessages = pushTokens.map((pushToken) => ({
            body: `${cityData.temperature} ºC`,
            data: cityData,
            title: `Barcelona is ${cityData.weatherName} today`,
            to: pushToken
        }));

        const expo = new Expo();
        return expo.sendPushNotificationsAsync(expoPushMessages);
        /* Note that expo.sendPushNotificationsAsync will not send the push notifications
         * to the user immediately but will send the information to Expo notifications
         * service instead, which will later send the notifications to the users */
    });