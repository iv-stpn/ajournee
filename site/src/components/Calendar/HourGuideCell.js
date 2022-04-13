import * as React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import tw from "twrnc";

export const HourGuideCell = ({
    cellHeight,
    onPress,
    date,
    hour,
    index,
    calendarCellStyle,
}) => {
    const getCalendarCellStyle = React.useMemo(
        () =>
            typeof calendarCellStyle === "function"
                ? calendarCellStyle
                : () => calendarCellStyle,
        [calendarCellStyle]
    );

    return (
        <TouchableWithoutFeedback onPress={() => onPress(date.hour(hour).minute(0))}>
            <View
                style={[
                    tw`border-l border-b border-gray-600`,
                    { height: cellHeight },
                    { ...getCalendarCellStyle(date.toDate(), index) },
                ]}
            />
        </TouchableWithoutFeedback>
    );
};
