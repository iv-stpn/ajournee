import React from "react";
import { View } from "react-native";
import Text from "@/components/App/Text";

import { getHeaderTitle } from "@react-navigation/elements";

import tw from "twrnc";

export const Header = ({ navigation, route, options, children }) => {
    const title = getHeaderTitle(options, route.name);
    return (
        <View style={tw`w-full bg-slate-800 h-16 flex flex-row items-center`}>
            <Text style={tw`ml-6 text-gray-100 text-xl upper`}>{title}</Text>
            {children}
        </View>
    );
};
