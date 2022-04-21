import * as React from "react";
import { View } from "react-native";
import { formatHour } from "@/utils/calendarUtils";

import Text from "@/components/App/Text";

import tw from "twrnc";

const _HourGuideColumn = ({ cellHeight, hour, ampm }) => {
    return (
        <View style={[tw`flex items-center`, { height: cellHeight }]}>
            <Text style={[tw`text-gray-200 text-base`]}>{formatHour(hour, ampm)}</Text>
        </View>
    );
};

export const HourGuideColumn = React.memo(_HourGuideColumn, () => true);
