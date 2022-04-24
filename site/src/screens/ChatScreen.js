import React, { useState } from "react";
import { View, Pressable, useWindowDimensions, Platform, Keyboard } from "react-native";

import ScrollView from "@/components/App/ScrollView";

import { useDispatch, useSelector } from "react-redux";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

import Text from "@/components/App/Text";
import ChatInput from "@/components/Chat/ChatInput";

import { breakWord, CHAT_INPUT_MARGIN_X } from "@/styles/commonStyles";

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

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
        <View style={{...tw`flex-1 flex-row`}}>
            <View style={{...tw`flex-1 w-full`}}>
                <ScrollView style={{ ...tw`w-full` }}>
                    {commands.map((text, index) => (
                        <View style={[tw`flex-row`, { marginRight: "auto" }]} key={index}>
                            <Text style={[tw`bg-sky-500 rounded-md`,{backgroundColor: "#1d90f5"}, breakWord, textSpacing]}>
                                {text}
                            </Text>
                            <View style={[tw`flex-row`, { marginRight: "auto", marginTop: "auto" }]}>
                                <Pressable style={[tw`flex-row mr-6`]}>
                                    <MaterialCommunityIcons name="share" size={22} color="grey" />
                                </Pressable>
                                <Pressable
                                    onPress={() =>
                                        dispatch({
                                            type: "REMOVE_COMMAND",
                                            index,
                                        })
                                    }
                                >
                                    {/* <Text
                                        style={tw`bg-red-500 rounded-full w-5 h-5 text-center`}
                                    >
                                        X
                                    </Text> */}
                                </Pressable>
                            </View>
                        </View>
                    ))}
                    
            
                </ScrollView>
                
                <View
                    style={{
                        ...tw`bg-gray-800 mt-0 rounded-md overflow-hidden w-auto flex-row`,
                        marginLeft: CHAT_INPUT_MARGIN_X,
                        marginRight: CHAT_INPUT_MARGIN_X + 2,
                        marginBottom: CHAT_INPUT_MARGIN_X,
                        marginTop: CHAT_INPUT_MARGIN_X,
                        backgroundColor: "#424656"
                    }}
                >
                    <ChatInput />
                    <MaterialCommunityIcons style={{
                        ...tw`px-2 py-3`}} name="chat-alert" size={24} color="black" />
                </View>
            </View>
            {
                window.width > 700 && 
                <View style={{ ...tw`h-full w-4/12 flex-row max-w-md`, backgroundColor: '#272a37', borderColor: "#1e1f24", borderWidth: 1 }}>
                    <MaterialCommunityIcons name="account" size={100} color="#81a4dd" />
                    <Text style={{ color: 'white' }}>
                        JE SUIS VEry BIG
                    </Text>
                </View>
            }
        </View>
    );
};
