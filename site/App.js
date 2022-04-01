import {
    Text,
    View,
    TextInput,
    ScrollView,
    useWindowDimensions,
    Platform,
    StatusBar,
    Keyboard,
    KeyboardEvent,
} from "react-native";
import tw from "twrnc";

import React, { useState, FlatList } from "react";
import { registerRootComponent } from "expo";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { NavigationContainer } from "@react-navigation/native";

// const fontSize = 13;
const topbarHeight = 50;
const inputHeight = 40;
const margin = 8;

export const useKeyboardHeight = () => {
    const [keyboardHeight, setKeyboardHeight] = React.useState(0);

    function onKeyboardDidShow(e) {
        // Remove type here if not using TypeScript
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

    return keyboardHeight;
};

const Input = ({ childToParent }) => {
    const window = useWindowDimensions();
    const [text, setText] = React.useState("");

    const handleSubmit = (event) => {
        childToParent(text);
        setText("");
    };

    return (
        <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            onSubmitEditing={handleSubmit}
            placeholder="Entrez votre commande !"
            style={{
                ...tw`h-full w-full mb-[2px] text-white border-0`,
                ...Platform.select({
                    web: {
                        outline: "none",
                    },
                }),
                marginHorizontal: margin,
            }}
            placeholderTextColor="#ddd"
            blurOnSubmit={false}
        />
    );
};

const Container = () => {
    const window = useWindowDimensions();
    const keyboardHeight = useKeyboardHeight();

    const [textArray, setTextArray] = useState(["texet"]);

    return (
        <View
            style={{
                ...tw`bg-slate-900 flex-1 w-full`,
            }}
        >
            <View>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                    }}
                    style={{
                        height:
                            window.height -
                            ((StatusBar.currentHeight ?? 0) +
                                keyboardHeight +
                                topbarHeight +
                                inputHeight +
                                margin),
                        width: window.width - margin,
                    }}
                >
                    <View>
                        <Text style={{ color: "white" }}>
                            {JSON.stringify(window.width)}
                            {"    "}
                            {JSON.stringify(window.width - 2 * margin)}
                        </Text>
                        {textArray.map((text, i) => (
                            <Text
                                key={i}
                                style={{
                                    ...tw`bg-sky-500 rounded-md p-[5px]`,
                                    margin: margin,
                                    ...Platform.select({
                                        web: {
                                            wordBreak: "break-word",
                                        },
                                    }),
                                    marginRight: "auto",
                                }}
                            >
                                {text}
                            </Text>
                        ))}
                    </View>
                </ScrollView>
            </View>

            <View
                style={{
                    ...tw`bg-gray-800 m-[${margin}px] mt-0 rounded-md absolute bottom-0 left-0`,
                    height: inputHeight,
                    width: window.width - 2 * margin,
                }}
            >
                <Input childToParent={(text) => setTextArray([...textArray, text])} />
            </View>
        </View>
    );
};

const About = () => <Text style={tw`text-white self-center mt-10`}>About</Text>;

const Tab = createMaterialTopTabNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <StatusBar animated={true} />
            <Tab.Navigator
                screenOptions={{ tabBarStyle: { height: topbarHeight } }}
                sceneContainerStyle={tw`bg-slate-900 text-white`}
            >
                <Tab.Screen name="Home" component={Container} />
                <Tab.Screen name="Settings" component={About} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

registerRootComponent(App);
export default App;
