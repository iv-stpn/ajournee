import { View, Platform } from "react-native";
import { WebView } from "react-native-webview";

import Text from "@/components/App/Text";

import tw from "twrnc";
import { ExtensionImporter } from "@/extensions/ExtensionImporter";

export const ContactScreen = () => {
    return (
        <View>
            <Text style={{ color: "white" }}>ContactScreen</Text>
        </View>
    );
};
