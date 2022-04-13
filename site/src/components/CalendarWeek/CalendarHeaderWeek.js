import { $dayjs } from "@/utils/calendarUtils";
import * as React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Text from "@/components/App/Text";

import { eventCellCss } from "@/styles/commonStyles";
import { isToday } from "@/utils/calendarUtils";

import tw from "twrnc";

function _CalendarHeaderWeek({
    dateRange,
    cellHeight,
    style,
    allDayEvents,
    onPressDateHeader,
    onPressEvent,
    activeDate,
}) {
    const _onPressHeader = React.useCallback(
        (date) => {
            onPressDateHeader && onPressDateHeader(date);
        },
        [onPressDateHeader]
    );

    const _onPressEvent = React.useCallback(
        (event) => {
            onPressEvent && onPressEvent(event);
        },
        [onPressEvent]
    );

    return (
        <View
            style={[
                tw`flex-row`,
                // theme?.isRTL ? u["flex-row-reverse"] : u["flex-row"],
                style,
            ]}
        >
            <View style={tw`w-1/8`} />
            {dateRange.map((date) => {
                const shouldHighlight = activeDate
                    ? date.isSame(activeDate, "date")
                    : isToday(date);

                return (
                    <TouchableOpacity
                        style={tw`flex-1 pt-2`}
                        onPress={() => _onPressHeader(date.toDate())}
                        disabled={onPressDateHeader === undefined}
                        key={date.toString()}
                    >
                        <View style={[{ height: cellHeight }, tw`justify-between`]}>
                            <Text
                                style={[
                                    tw`text-base text-center mt-2`,
                                    shouldHighlight
                                        ? tw`text-blue-500`
                                        : tw`text-gray-200`,
                                ]}
                            >
                                {date.format("ddd")}
                            </Text>
                            <View
                                style={[
                                    shouldHighlight
                                        ? tw`bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center self-center z-20`
                                        : {},
                                    tw`pb-6`,
                                ]}
                            >
                                <Text
                                    style={[
                                        shouldHighlight
                                            ? tw`text-white`
                                            : tw`text-gray-600`,
                                        tw`text-xl text-center`,
                                        Platform.OS === "web" &&
                                            shouldHighlight &&
                                            tw`mt-6`,
                                    ]}
                                >
                                    {date.format("D")}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                tw`border-b border-l border-gray-200`,
                                { height: cellHeight },
                            ]}
                        >
                            {allDayEvents.map((event) => {
                                if (
                                    !$dayjs(date).isBetween(
                                        event.start,
                                        event.end,
                                        "day",
                                        "[]"
                                    )
                                ) {
                                    return null;
                                }
                                return (
                                    <TouchableOpacity
                                        style={[
                                            eventCellCss.style,
                                            tw`bg-blue-500`,
                                            tw`mt-2`,
                                        ]}
                                        key={`${event.start}${event.title}`}
                                        onPress={() => _onPressEvent(event)}
                                    >
                                        <Text style={tw`text-sm text-white`}>
                                            {event.title}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export const CalendarHeaderWeek = React.memo(_CalendarHeaderWeek);
