
import { Subscription } from '@unimodules/core';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, Platform, ScrollView, Text, View } from 'react-native';
import JSONTree from 'react-native-json-tree';
import {
    modifyWeatherSubscription,
    retrieveWeatherSubscription,
    testSubscription
} from './server-operations';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
});

const getPushToken = () => {
    if (!Constants.isDevice) {
        return Promise.reject('Must use physical device for Push Notifications');
    }

    try {
        return Notifications.getPermissionsAsync()
            .then((statusResult) => {
                return statusResult.status !== 'granted'
                    ? Notifications.requestPermissionsAsync()
                    : statusResult;
            })
            .then((statusResult) => {
                if (statusResult.status !== 'granted') {
                    throw 'Failed to get push token for push notification!';
                }
                return Notifications.getExpoPushTokenAsync();
            })
            .then((tokenData) => tokenData.data);
    } catch (error) {
        return Promise.reject("Couldn't check notifications permissions");
    }
};

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [notification, setNotification] = useState();
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        getPushToken().then((pushToken) => {
            setExpoPushToken(pushToken);
            if (pushToken) {
                retrieveWeatherSubscription(pushToken, setIsSubscribed);
            }
        });

        notificationListener.current =
            Notifications.addNotificationReceivedListener(setNotification);

        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                setNotification(response.notification);
            }
        );

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
                Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <ScrollView>
            <View>
                <Text>Daily weather notification</Text>

                {expoPushToken && (
                    <View>
                        <Button
                            onPress={() =>
                                modifyWeatherSubscription(
                                    expoPushToken,
                                    !isSubscribed,
                                    setIsSubscribed
                                )
                            }
                            title={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                        />
                        <Button
                            onPress={() => testSubscription(expoPushToken)}
                            title="Send it now"
                        />
                    </View>
                )}
                <Text>Your expo push token:</Text>
                <Text selectable={true}>{expoPushToken || '-'}</Text>
            </View>

            <View>
                <Text>Notification content</Text>

                {notification ? (
                    <React.Fragment>
                        <Image
                            source={{
                                uri: notification.request.content.data.weatherIcon
                            }}
                        />
                        <Text>{notification.request.content.data.temperature} ºC</Text>

                        <JSONTree data={JSON.parse(JSON.stringify(notification))} />
                        <Button
                            onPress={() => setNotification(undefined)}
                            title="Clear notification"
                        />
                    </React.Fragment>
                ) : (
                    <Text>-</Text>
                )}
            </View>
        </ScrollView>
    );
}

