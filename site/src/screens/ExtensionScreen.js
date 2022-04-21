import { ExtensionImporter } from "@/extensions/ExtensionImporter";
import { View, Text } from "react-native";

export const ExtensionScreen = () => {
    return (
        <View>
            <Text style={{ color: "white" }}>ExtensionScreen</Text>
            <ExtensionImporter path="./Test.js" />
        </View>
    );
};
