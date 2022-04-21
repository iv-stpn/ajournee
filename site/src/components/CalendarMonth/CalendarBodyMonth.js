import { $dayjs } from "@/utils/calendarUtils";
import _ from "lodash";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import Text from "@/components/App/Text";

import tw from "twrnc";

import { useNow } from "@/hooks/useNow";
import { usePanResponder } from "@/hooks/usePanResponder";

import {
    getNonVisibleMonthEventsCount,
    getWeeksWithAdjacentMonths,
} from "@/utils/calendarUtils";
import { CalendarEventMonth } from "@/components/CalendarMonth/CalendarEventMonth";
import { TouchableOpacity } from "react-native";

function _CalendarBodyMonth({
    containerHeight,
    targetDate,
    style,
    onPressCell,
    events,
    onPressEvent,
    eventCellStyle,
    calendarCellStyle,
    calendarCellTextStyle,
    onSwipeHorizontal,
    hideNowIndicator,
    showAdjacentMonths,
    renderEvent,
    maxVisibleEventCount,
    weekStartsOn,
    eventMinHeightForMonthView,
    moreLabel,
}) {
    const [calendarWidth, setCalendarWidth] = useState(0);
    const { now } = useNow(!hideNowIndicator);

    const getTextStyle = (date) => {
        if (date?.format("YYYY-MM-DD") === now.format("YYYY-MM-DD"))
            return tw`text-blue-500`;

        if (date?.month() !== targetDate.month()) return tw`text-gray-500`;

        return tw`text-gray-100`;
    };

    const panResponder = usePanResponder({
        onSwipeHorizontal,
    });

    const weeks = getWeeksWithAdjacentMonths(targetDate, 6, weekStartsOn);

    const minCellHeight = containerHeight / 5 - 30;

    const getCalendarCellStyle = React.useMemo(
        () =>
            typeof calendarCellStyle === "function"
                ? calendarCellStyle
                : () => calendarCellStyle,
        [calendarCellStyle]
    );

    const getCalendarCellTextStyle = React.useMemo(
        () =>
            typeof calendarCellTextStyle === "function"
                ? calendarCellTextStyle
                : () => calendarCellTextStyle,
        [calendarCellTextStyle]
    );

    const generateEvents = React.useCallback(
        (week) => {
            // generate events and sort them
            const weekEvents = week.map((d) => {
                const date = $dayjs(d.toDate());

                return events
                    .filter(({ start, end }) =>
                        date.isBetween(
                            $dayjs(start).startOf("day"),
                            $dayjs(end).endOf("day"),
                            null,
                            "[)"
                        )
                    )
                    .sort((a, b) => {
                        if ($dayjs(a.start).isSame(b.start, "day")) {
                            const aDuration = $dayjs
                                .duration($dayjs(a.end).diff($dayjs(a.start)))
                                .asDays();
                            const bDuration = $dayjs
                                .duration($dayjs(b.end).diff($dayjs(b.start)))
                                .asDays();
                            return bDuration - aDuration;
                        }

                        return a.start.getTime() - b.start.getTime();
                    });
            });

            // fix sorting to match UI
            return _.reduce(
                weekEvents,
                (orderedEvents, dayEvents, dayIdx) => {
                    orderedEvents.push(
                        _.reduce(
                            dayEvents,
                            (orderedDayEvents, e, i) => {
                                const event = _.cloneDeep(e);
                                // limit reorder to visible events
                                // register original position
                                if (
                                    typeof event.position === "undefined" &&
                                    (dayIdx === 0 ||
                                        targetDate
                                            .date(week[dayIdx])
                                            .isSame(event.start, "day"))
                                ) {
                                    // check if position is already taken
                                    const alreadyRegistered = orderedDayEvents.findIndex(
                                        (d) => d.position === i
                                    );
                                    let position = alreadyRegistered;
                                    if (alreadyRegistered !== -1) {
                                        // find next free position
                                        for (
                                            let j = 0;
                                            j < orderedDayEvents.length;
                                            j++
                                        ) {
                                            const checkPosition =
                                                orderedDayEvents.findIndex(
                                                    (d) => d.position === j
                                                );
                                            if (checkPosition === -1) {
                                                position = j;
                                                break;
                                            }
                                        }
                                    }
                                    event.position = position > -1 ? position : i;
                                } else if (typeof event.position === "undefined") {
                                    const prevEvent = orderedEvents[dayIdx - 1].find(
                                        (d) => d.id === event.id
                                    );
                                    event.position = prevEvent ? prevEvent.position : i;
                                }
                                orderedDayEvents.push(event);
                                return orderedDayEvents;
                            },
                            []
                        ).sort((a, b) => {
                            if (
                                typeof a.position !== "undefined" &&
                                typeof b.position !== "undefined"
                            ) {
                                return a.position - b.position;
                            }
                            return 1;
                        })
                    );
                    return orderedEvents;
                },
                []
            );
        },
        [events, showAdjacentMonths, targetDate]
    );

    return (
        <View
            style={[
                {
                    height: containerHeight,
                },
                tw`flex-1 flex-col rounded`,
                style,
            ]}
            onLayout={({ nativeEvent: { layout } }) => setCalendarWidth(layout.width)}
            // {...panResponder.panHandlers}
        >
            {weeks.map((week, i) => {
                const weekEvents = generateEvents(week);
                return (
                    <View
                        key={i}
                        style={[
                            tw`flex-1 flex-row`,
                            // theme.isRTL ? u["flex-row-reverse"] : u["flex-row"],
                            Platform.OS === "android" && style, // TODO: in Android, backgroundColor is not applied to child components
                            // {
                            //     minHeight: minCellHeight,
                            // },
                        ]}
                    >
                        {week.map((date, j) => (
                            <TouchableOpacity
                                onPress={() =>
                                    date &&
                                    onPressCell &&
                                    onPressCell(date.toDate(), weekEvents[j])
                                }
                                style={[
                                    tw`flex-1 flex-col`,
                                    i !== weeks.length - 1
                                        ? tw`border-b border-gray-600`
                                        : {},
                                    date.month() !== targetDate.month() &&
                                        tw`bg-stone-900`,
                                    {
                                        // minHeight: minCellHeight,
                                        ...getCalendarCellStyle(date?.toDate(), i),
                                    },
                                ]}
                                key={j}
                            >
                                <Text
                                    style={[
                                        tw`text-sm font-medium mt-1`,
                                        getTextStyle(date),
                                        {
                                            textAlign: "center",
                                            ...getCalendarCellTextStyle(
                                                date?.toDate(),
                                                i
                                            ),
                                        },
                                    ]}
                                >
                                    {date.format("D")}
                                </Text>
                                <View style={tw`m-1.5`}>
                                    {weekEvents[j].reduce(
                                        (elements, event, index, events) => {
                                            let moreCount = 0;
                                            if (index === maxVisibleEventCount) {
                                                const nonVisibleCount =
                                                    getNonVisibleMonthEventsCount(
                                                        weekEvents[j - 1],
                                                        events,
                                                        date,
                                                        j,
                                                        showAdjacentMonths,
                                                        maxVisibleEventCount
                                                    );
                                                moreCount =
                                                    events.length +
                                                    nonVisibleCount -
                                                    maxVisibleEventCount;
                                            }
                                            return [
                                                ...elements,
                                                index >
                                                maxVisibleEventCount ? null : index ===
                                                  maxVisibleEventCount ? (
                                                    <Text
                                                        key={index}
                                                        style={[
                                                            // theme.typography
                                                            //     .moreLabel,
                                                            {
                                                                marginTop: 2,
                                                                // color: theme.palette
                                                                //     .moreLabel,
                                                            },
                                                        ]}
                                                    >
                                                        {moreLabel.replace(
                                                            "{moreCount}",
                                                            `${moreCount}`
                                                        )}
                                                    </Text>
                                                ) : (
                                                    <CalendarEventMonth
                                                        key={index}
                                                        event={event}
                                                        eventCellStyle={eventCellStyle}
                                                        onPressEvent={onPressEvent}
                                                        onPressCell={() =>
                                                            onPressCell &&
                                                            onPressCell(
                                                                date.toDate(),
                                                                weekEvents[j]
                                                            )
                                                        }
                                                        renderEvent={renderEvent}
                                                        date={date}
                                                        dayOfTheWeek={j}
                                                        calendarWidth={calendarWidth}
                                                        // isRTL={theme.isRTL}
                                                        eventMinHeightForMonthView={
                                                            eventMinHeightForMonthView
                                                        }
                                                        showAdjacentMonths={
                                                            showAdjacentMonths
                                                        }
                                                    />
                                                ),
                                            ];
                                        },
                                        []
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            })}
        </View>
    );
}

export const CalendarBodyMonth = React.memo(_CalendarBodyMonth);
