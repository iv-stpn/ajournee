import { $dayjs } from "@/utils/calendarUtils";
import React from "react";
import { eventCellCss } from "@/styles/commonStyles";

export function useCalendarTouchableOpacityProps({
    event,
    eventCellStyle,
    injectedStyles = [],
    onPressEvent,
    date,
}) {
    const getEventStyle = React.useMemo(
        () =>
            typeof eventCellStyle === "function" ? eventCellStyle : () => eventCellStyle,
        [eventCellStyle]
    );

    const plainJsEvent = React.useMemo(
        () => ({
            ...event,
            start: $dayjs(event.start).toDate(),
            end: $dayjs(event.end).toDate(),
        }),
        [event]
    );

    const _onPress = React.useCallback(() => {
        onPressEvent && onPressEvent(plainJsEvent, date);
    }, [onPressEvent, plainJsEvent, date]);

    const touchableOpacityProps = {
        delayPressIn: 20,
        key: event.start.toString(),
        style: [eventCellCss.style, ...injectedStyles, getEventStyle(plainJsEvent)],
        onPress: _onPress,
        disabled: !onPressEvent,
    };

    return touchableOpacityProps;
}
