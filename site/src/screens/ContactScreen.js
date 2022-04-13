import { View } from "react-native";

import Text from "@/components/App/Text";
import { Ripple } from "@/components/App/TouchableRipple";

import tw from "twrnc";

export const ContactScreen = () => {
    return (
        <View>
            <Ripple rippleSize={176} rippleDuration={500}>
                <Text style={tw`text-white self-center mt-10`}>About</Text>
            </Ripple>
        </View>
    );
};
