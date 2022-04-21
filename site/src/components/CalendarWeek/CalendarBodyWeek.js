import { $dayjs } from "@/utils/calendarUtils";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";

import ScrollView from "../App/ScrollView";

import { useNow } from "@/hooks/useNow";
import { usePanResponder } from "@/hooks/usePanResponder";
import {
    getCountOfEventsAtEvent,
    getOrderOfEvent,
    getRelativeTopInDay,
    hours,
    isToday,
} from "../../utils/calendarUtils";

import { CalendarEventWeek } from "@/components/CalendarWeek/CalendarEventWeek";
import { HourGuideCell } from "@/components/Calendar/HourGuideCell";
import { HourGuideColumn } from "@/components/Calendar/HourGuideColumn";

import tw from "twrnc";

const styles = StyleSheet.create({
    nowIndicator: {
        position: "absolute",
        zIndex: 10000,
        height: 2,
        width: "100%",
    },
});

function _CalendarBodyWeek({
    containerHeight,
    cellHeight,
    dateRange,
    style,
    onPressCell,
    events,
    onPressEvent,
    eventCellStyle,
    calendarCellStyle,
    ampm,
    showTime,
    scrollOffsetMinutes,
    onSwipeHorizontal,
    hideNowIndicator,
    overlapOffset,
    renderEvent,
    headerComponent = null,
    headerComponentStyle = {},
    hourStyle = {},
}) {
    const scrollView = React.useRef(null);
    const { now } = useNow(!hideNowIndicator);

    // const scrollOffsetMinutes = 1;
    // React.useEffect(() => {
    //     if (scrollView.current && scrollOffsetMinutes && Platform.OS !== "ios") {
    //         // We add delay here to work correct on React Native
    //         // see: https://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working
    //         setTimeout(
    //             () => {
    //                 if (scrollView && scrollView.current) {
    //                     scrollView.current.scrollTo({
    //                         y: (cellHeight * scrollOffsetMinutes) / 60,
    //                         animated: false,
    //                     });
    //                 }
    //             },
    //             Platform.OS === "web" ? 0 : 10
    //         );
    //     }
    // }, [scrollView, scrollOffsetMinutes, cellHeight]);

    const panResponder = usePanResponder({
        onSwipeHorizontal,
    });

    const _onPressCell = React.useCallback(
        (date) => {
            onPressCell && onPressCell(date.toDate());
        },
        [onPressCell]
    );

    const _renderMappedEvent = (event) => (
        <CalendarEventWeek
            key={`${event.start}${event.title}${event.end}`}
            event={event}
            onPressEvent={onPressEvent}
            eventCellStyle={eventCellStyle}
            showTime={showTime}
            eventCount={getCountOfEventsAtEvent(event, events)}
            eventOrder={getOrderOfEvent(event, events)}
            overlapOffset={overlapOffset}
            renderEvent={renderEvent}
            ampm={ampm}
            date={now}
        />
    );

    return (
        <React.Fragment>
            {headerComponent != null && (
                <View style={headerComponentStyle}>{headerComponent}</View>
            )}
            <ScrollView innerRef={scrollView}>
                <View
                    style={[
                        tw`flex-1 flex-row`,
                        // theme.isRTL ? u["flex-row-reverse"] : u["flex-row"],
                    ]}
                    {...(Platform.OS === "web" ? panResponder.panHandlers : {})}
                >
                    <View style={tw`z-20 w-1/8`}>
                        {hours.map((hour) => (
                            <HourGuideColumn
                                key={hour}
                                cellHeight={cellHeight}
                                hour={hour}
                                ampm={ampm}
                                hourStyle={hourStyle}
                            />
                        ))}
                    </View>
                    {dateRange.map((date) => (
                        <View style={tw`w-1/8 overflow-hidden`} key={date.toString()}>
                            {hours.map((hour, index) => (
                                <HourGuideCell
                                    key={hour}
                                    cellHeight={cellHeight}
                                    date={date}
                                    hour={hour}
                                    onPress={_onPressCell}
                                    index={index}
                                    calendarCellStyle={calendarCellStyle}
                                />
                            ))}

                            {/* Render events of this date */}
                            {/* M  T  (W)  T  F  S  S */}
                            {/*       S-E             */}
                            {events
                                .filter(({ start }) =>
                                    $dayjs(start).isBetween(
                                        date.startOf("day"),
                                        date.endOf("day"),
                                        null,
                                        "[)"
                                    )
                                )
                                .map(_renderMappedEvent)}

                            {/* Render events which starts before this date and ends on this date */}
                            {/* M  T  (W)  T  F  S  S */}
                            {/* S------E              */}
                            {events
                                .filter(
                                    ({ start, end }) =>
                                        $dayjs(start).isBefore(date.startOf("day")) &&
                                        $dayjs(end).isBetween(
                                            date.startOf("day"),
                                            date.endOf("day"),
                                            null,
                                            "[)"
                                        )
                                )
                                .map((event) => ({
                                    ...event,
                                    start: $dayjs(event.end).startOf("day"),
                                }))
                                .map(_renderMappedEvent)}

                            {/* Render events which starts before this date and ends after this date */}
                            {/* M  T  (W)  T  F  S  S */}
                            {/*    S-------E          */}
                            {events
                                .filter(
                                    ({ start, end }) =>
                                        $dayjs(start).isBefore(date.startOf("day")) &&
                                        $dayjs(end).isAfter(date.endOf("day"))
                                )
                                .map((event) => ({
                                    ...event,
                                    start: $dayjs(event.end).startOf("day"),
                                    end: $dayjs(event.end).endOf("day"),
                                }))
                                .map(_renderMappedEvent)}

                            {isToday(date) && !hideNowIndicator && (
                                <View
                                    style={[
                                        styles.nowIndicator,
                                        // { backgroundColor: theme.palette.nowIndicator },
                                        { top: `${getRelativeTopInDay(now)}%` },
                                    ]}
                                />
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </React.Fragment>
    );
}

export const CalendarBodyWeek = React.memo(_CalendarBodyWeek);
