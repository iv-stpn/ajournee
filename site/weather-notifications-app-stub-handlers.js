import { Subscription } from '@unimodules/core';
/* ... */
import {
    modifyWeatherSubscription,
    retrieveWeatherSubscription,
    testSubscription
} from './server-operations';

Notifications.setNotificationHandler(/* ... */);

const getPushToken = async () => {
    /* ... */
};

let notificationsHandler ;
const pendingNotifications = [];

const notificationReceivedListener = Notifications.addNotificationReceivedListener(
    (notification) => {
        if (notificationsHandler !== undefined) {
            notificationsHandler(notification);
        } else {
            pendingNotifications.push(notification);
        }
    }
);

const notificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
        if (notificationsHandler !== undefined) {
            notificationsHandler(response.notification);
        } else {
            pendingNotifications.push(response.notification);
        }
    }
);

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState();
    /* ... */

    useEffect(() => {
        notificationsHandler = setNotification;

        while (pendingNotifications.length > 0) {
            const pendingNotification = pendingNotifications.pop();
            notificationsHandler(pendingNotification);
        }

        getPushToken().then((pushToken) => {
            /* ... */
        });

        notificationListener.current = notificationReceivedListener;

        responseListener.current = notificationResponseReceivedListener;

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return <ScrollView>{/* ... */}</ScrollView>;
}