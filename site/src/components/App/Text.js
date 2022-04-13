import { Text } from "react-native";

export default ({ ...props }) => {
    return (
        <Text {...props} style={[{ fontFamily: "Montserrat" }, props.style]}>
            {props.children}
        </Text>
    );
};
