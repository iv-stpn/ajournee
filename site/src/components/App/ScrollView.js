import { ScrollView, Platform } from "react-native";

export default ({ innerRef, ...props }) => (
    <ScrollView
        scrollEventThrottle={32}
        // {...(Platform.OS !== "web" ? panResponder.panHandlers : {})}
        // showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        // contentOffset={
        //     Platform.OS === "ios" ? { x: 0, y: scrollOffsetMinutes } : { x: 0, y: 0 }
        // }
        ref={innerRef}
        {...props}
    ></ScrollView>
);
