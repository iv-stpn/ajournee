import { $dayjs } from "@/utils/calendarUtils";
import * as React from "react";
import { TouchableOpacity } from "react-native";
import Text from "@/components/App/Text";

import tw from "twrnc";

import { formatStartEnd } from "@/utils/calendarUtils";

export function DefaultCalendarEventRenderer({
    touchableOpacityProps,
    event,
    showTime = true,
    textColor,
    ampm,
}) {
    return (
        <TouchableOpacity {...touchableOpacityProps}>
            {$dayjs(event.end).diff(event.start, "minute") < 32 && showTime ? (
                <Text style={[tw`text-sm`, { color: textColor }]}>
                    {event.title},
                    <Text style={[tw`text-xs`, { color: textColor }]}>
                        {$dayjs(event.start).format(ampm ? "hh:mm a" : "HH:mm")}
                    </Text>
                </Text>
            ) : (
                <>
                    <Text style={[tw`text-sm`, { color: textColor }]}>{event.title}</Text>
                    {showTime && (
                        <Text style={[tw`text-xs`, { color: textColor }]}>
                            {formatStartEnd(
                                event.start,
                                event.end,
                                ampm ? "h:mm a" : "HH:mm"
                            )}
                        </Text>
                    )}
                    {event.children && event.children}
                </>
            )}
        </TouchableOpacity>
    );
}
