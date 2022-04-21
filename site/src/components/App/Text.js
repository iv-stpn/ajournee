import { Text } from "react-native";

export default ({ ...props }) => {
    return <Text {...props}>{props.children}</Text>;
};
