import { $dayjs } from "@/utils/calendarUtils";
import * as React from "react";
import { View } from "react-native";
import tw from "twrnc";

import Text from "@/components/App/Text";

import { getDatesInWeek } from "@/utils/calendarUtils";

function _CalendarHeaderForMonthView({ locale, weekStartsOn, targetDate }) {
    const today = $dayjs();
    const dates = getDatesInWeek(today.toDate(), weekStartsOn, locale);
    const todayWeekNum = today.day();
    return (
        <View
            style={tw`flex-row border-b border-gray-100`}
            // theme.isRTL ? u["flex-row-reverse"] : u["flex-row"],}
        >
            {dates.map((date) => (
                <View style={tw`flex-1 py-2`} key={date.toISOString()}>
                    <Text
                        style={[
                            tw`text-sm text-center`,
                            todayWeekNum === date.day() &&
                            today.month() === targetDate.month()
                                ? tw`text-blue-500`
                                : tw`text-white`,
                        ]}
                    >
                        {date.format("ddd")}
                    </Text>
                </View>
            ))}
        </View>
    );
}

export const CalendarHeaderMonth = React.memo(_CalendarHeaderForMonthView);
