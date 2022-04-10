import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions';
import { sendPushNotifications } from './utils';

firebase.initializeApp();

/* Firebase function that runs everyday at 8:00 AM (Spanish timezone) */
export const dailyWeatherNotification = functions.pubsub
    .schedule('0 8 * * *')
    .timeZone('Europe/Madrid')
    .onRun(() => {
        return firebase
            .database()
            .ref('subscriptions')
            .once('value')
            .then((subscriptionsSnapshot) => {
                const subscriptions = subscriptionsSnapshot.val();

                if (subscriptions) {
                    const pushTokens = Object.keys(subscriptions)
                        .filter((subscriptionKey) => subscriptions[subscriptionKey].active === true)
                        .map((subscriptionKey) => subscriptions[subscriptionKey].token);

                    return sendPushNotifications(pushTokens);
                } else {
                    /* ... */
                }
            });
    });

/* HTTPS endpoint that can be used at any time to send a notification to a given device */
export const testNotification = functions.https.onRequest((req, res) => {
    const pushToken = req.query.token ;

    if (!pushToken) {
        res.status(400).send('No pushToken provided');
    } else {
        sendPushNotifications([pushToken]).then(() => {
            res.status(200).send('Ok');
        });
    }
});