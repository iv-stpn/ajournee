import { $dayjs } from "@/utils/calendarUtils";
import * as React from "react";

import tw from "twrnc";

import { OVERLAP_OFFSET, OVERLAP_PADDING } from "@/styles/commonStyles";
import { useCalendarTouchableOpacityProps } from "@/hooks/useCalendarTouchableOpacityProps";
import { DAY_MINUTES, getRelativeTopInDay } from "@/utils/calendarUtils";
import { DefaultCalendarEventRenderer } from "@/components/Calendar/CalendarEvent";

const getEventCellPositionStyle = (start, end) => {
    const relativeHeight = 100 * (1 / DAY_MINUTES) * $dayjs(end).diff(start, "minute");
    const relativeTop = getRelativeTopInDay($dayjs(start));
    return {
        height: `${relativeHeight}%`,
        top: `${relativeTop}%`,
    };
};

export function getStyleForOverlappingEvent(eventPosition, overlapOffset) {
    let overlapStyle = {};
    const offset = overlapOffset;
    const start = eventPosition * offset;
    const zIndex = 100 + eventPosition;
    const bgColors = ["#E26245", "#4AC001", "#5934C7"];
    overlapStyle = {
        start: start + OVERLAP_PADDING,
        end: OVERLAP_PADDING,
        backgroundColor: bgColors[eventPosition % bgColors.length] || bgColors[0],
        zIndex,
    };
    return overlapStyle;
}

function _CalendarEventWeek({
    event,
    onPressEvent,
    eventCellStyle,
    showTime,
    eventOrder = 0,
    overlapOffset = OVERLAP_OFFSET,
    renderEvent,
    ampm,
    date,
}) {
    // const theme = useTheme();

    // const palettes = React.useMemo(
    //     () => [theme.palette.primary, ...theme.eventCellOverlappings],
    //     [theme]
    // );

    const touchableOpacityProps = useCalendarTouchableOpacityProps({
        event,
        eventCellStyle,
        onPressEvent,
        injectedStyles: [
            getEventCellPositionStyle(event.start, event.end),
            getStyleForOverlappingEvent(eventOrder, overlapOffset),
            tw`absolute mt-2 mx-3`,
        ],
        date,
    });

    if (renderEvent) {
        return renderEvent(event, touchableOpacityProps);
    }

    return (
        <DefaultCalendarEventRenderer
            event={event}
            showTime={showTime}
            ampm={ampm}
            touchableOpacityProps={touchableOpacityProps}
            textColor={"#fff"}
        />
    );
}

export const CalendarEventWeek = React.memo(_CalendarEventWeek);
