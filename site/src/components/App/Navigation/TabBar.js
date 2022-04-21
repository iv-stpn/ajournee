import { View } from "react-native";
import Text from "@/components/App/Text";

import tw from "twrnc";
import { selectNone } from "@/styles/commonStyles";
import { TouchableOpacity } from "react-native";

export function TabBar({ state, descriptors, navigation }) {
    return (
        <View style={tw`flex-row justify-center items-center h-16 w-full bg-slate-800`}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={tw`flex-1 justify-center items-center h-full`}
                        key={index}
                    >
                        <options.tabBarIcon
                            size={isFocused ? 28 : 25}
                            {...(isFocused ? tw`text-blue-500` : tw`text-gray-500`)}
                            style={selectNone}
                        />
                        <Text
                            style={[
                                tw`text-xs pt-0.5`,
                                isFocused ? tw`text-blue-500` : tw`text-gray-500`,
                                selectNone,
                            ]}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
