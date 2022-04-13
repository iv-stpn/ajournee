import React, { useState } from "react";
import { View, Pressable, useWindowDimensions, Platform, Keyboard } from "react-native";

import ScrollView from "@/components/App/ScrollView";

import { useDispatch, useSelector } from "react-redux";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

import Text from "@/components/App/Text";
import ChatInput from "@/components/Chat/ChatInput";

import { breakWord, CHAT_INPUT_MARGIN_X } from "@/styles/commonStyles";

import tw from "twrnc";

export const useKeyboardHeight = () => {
    const [_keyboardHeight, setKeyboardHeight] = useState(0);

    function onKeyboardDidShow(e) {
        setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
        setKeyboardHeight(0);
    }

    React.useEffect(() => {
        const showSubscription = Keyboard.addListener(
            "keyboardDidShow",
            onKeyboardDidShow
        );
        const hideSubscription = Keyboard.addListener(
            "keyboardDidHide",
            onKeyboardDidHide
        );
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return _keyboardHeight;
};

export const ChatScreen = () => {
    const window = useWindowDimensions();
    const keyboardHeight = useKeyboardHeight();

    const dispatch = useDispatch();
    const commands = useSelector((state) => state.commands);

    const bottomTabBarHeight = useBottomTabBarHeight();
    const topbarHeight = useHeaderHeight();

    const textSpacing = { margin: CHAT_INPUT_MARGIN_X, marginRight: "auto", padding: 5 };

    return (
        <View style={tw`bg-slate-900 flex-1 w-full`}>
            <ScrollView style={{ width: window.width - CHAT_INPUT_MARGIN_X }}>
                {commands.map((text, index) => (
                    <View key={index}>
                        <Text style={[tw`bg-sky-500 rounded-md`, breakWord, textSpacing]}>
                            {text}
                        </Text>
                        <View style={[tw`flex-row`, { marginLeft: CHAT_INPUT_MARGIN_X }]}>
                            <Pressable>
                                <Text
                                    style={tw`bg-green-500 rounded-full w-10 h-5 text-center mr-2`}
                                >
                                    See
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() =>
                                    dispatch({
                                        type: "REMOVE_COMMAND",
                                        index,
                                    })
                                }
                            >
                                <Text
                                    style={tw`bg-red-500 rounded-full w-5 h-5 text-center`}
                                >
                                    X
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View
                style={{
                    ...tw`bg-gray-800 mt-0 rounded-md`,
                    width: window.width - 2 * CHAT_INPUT_MARGIN_X,
                    marginHorizontal: CHAT_INPUT_MARGIN_X,
                    marginBottom: CHAT_INPUT_MARGIN_X,
                }}
            >
                <ChatInput />
            </View>
        </View>
    );
};
