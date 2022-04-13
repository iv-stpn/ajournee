import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import Text from "@/components/App/Text";

import { useCalendarTouchableOpacityProps } from "@/hooks/useCalendarTouchableOpacityProps";
import { getEventSpanningInfo } from "@/utils/calendarUtils";

import tw from "twrnc";
import dayjs from "dayjs";

function _CalendarEventMonth({
    event,
    onPressEvent,
    onPressCell,
    eventCellStyle,
    renderEvent,
    date,
    dayOfTheWeek,
    calendarWidth,
    isRTL,
    eventMinHeightForMonthView,
    showAdjacentMonths,
}) {
    date = dayjs(date.toDate());

    const { eventWidth, isMultipleDays, isMultipleDaysStart, eventWeekDuration } =
        React.useMemo(
            () =>
                getEventSpanningInfo(
                    event,
                    date,
                    dayOfTheWeek,
                    calendarWidth,
                    showAdjacentMonths
                ),
            [date, dayOfTheWeek, event, calendarWidth, showAdjacentMonths]
        );

    const touchableOpacityProps = useCalendarTouchableOpacityProps({
        event,
        eventCellStyle,
        onPressEvent,
        injectedStyles: [
            tw`bg-blue-500`,
            isMultipleDaysStart && eventWeekDuration > 1
                ? {
                      position: "absolute",
                      width: eventWidth,
                      zIndex: 10000,
                  }
                : {},
            isRTL ? { right: 0 } : { left: 0 },
        ],
        date,
    });

    return (
        <TouchableOpacity
            style={{ minHeight: eventMinHeightForMonthView, marginTop: 1.5 }}
            onPress={() => (onPressEvent ? onPressEvent?.(event, date) : onPressCell?.())}
        >
            {(!isMultipleDays && date.isSame(event.start, "day")) ||
            (isMultipleDays && isMultipleDaysStart) ? (
                renderEvent ? (
                    renderEvent(event, touchableOpacityProps, date)
                ) : (
                    <View {...touchableOpacityProps}>
                        <Text
                            style={[
                                tw`truncate text-xs text-white`,
                                isRTL && { textAlign: "right" },
                            ]}
                            numberOfLines={1}
                        >
                            {event.title}
                        </Text>
                    </View>
                )
            ) : null}
        </TouchableOpacity>
    );
}

export const CalendarEventMonth = React.memo(_CalendarEventMonth);
