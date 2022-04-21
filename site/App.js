import React from "react";
import { StatusBar } from "react-native";

import { persistor, store } from "@/reducers";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { registerRootComponent } from "expo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { TabBar } from "@/components/App/Navigation/TabBar";
import { Header } from "@/components/App/Navigation/Header";
import { AgendaTabHeader } from "@/components/App/Navigation/AgendaTabHeader";

import { CalendarScreen } from "@/screens/CalendarScreen";
import { ContactScreen } from "@/screens/ContactScreen";
import { ChatScreen } from "@/screens/ChatScreen";
import { ExtensionScreen } from "@/screens/ExtensionScreen";

import tw from "twrnc";

const Tab = createBottomTabNavigator();

const Tabs = {
    Units: {
        component: ChatScreen,
        label: "Ajouter",
        iconName: "plus-circle",
    },
    Agenda: {
        component: CalendarScreen,
        header: AgendaTabHeader,
        label: "Agenda",
        iconName: "calendar",
    },
    Contacts: {
        component: ContactScreen,
        label: "Contacts",
        iconName: "account-group",
    },
    Extensions: {
        component: ExtensionScreen,
        label: "Extensions",
        iconName: "puzzle-plus",
    },
};

const getMaterialIcon = (icon, props) => {
    return <MaterialCommunityIcons name={icon} {...props} />;
};

const App = () => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NavigationContainer>
                    <StatusBar animated={true} />

                    <Tab.Navigator
                        initialRouteName={Object.entries(Tabs)[0].name}
                        screenOptions={{ header: Header }}
                        sceneContainerStyle={tw`bg-gray-900 text-white`}
                        tabBar={TabBar}
                    >
                        {Object.entries(Tabs).map(
                            ([name, { component, header, label, iconName }], key) => (
                                <Tab.Screen
                                    key={key}
                                    name={name}
                                    component={component}
                                    options={{
                                        tabBarLabel: label,
                                        tabBarIcon: (props) =>
                                            getMaterialIcon(iconName, props),
                                        ...(header ? { header } : {}),
                                    }}
                                />
                            )
                        )}
                    </Tab.Navigator>
                </NavigationContainer>
            </PersistGate>
        </Provider>
    );
};

registerRootComponent(App);
export default App;
