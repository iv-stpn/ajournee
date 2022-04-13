import { $dayjs } from "@/utils/calendarUtils";
import React from "react";

import { MIN_HEIGHT } from "@/styles/commonStyles";

import {
    getDatesInMonth,
    getDatesInNextCustomDays,
    getDatesInNextOneDay,
    getDatesInNextThreeDays,
    getDatesInWeek,
    isAllDayEvent,
    modeToNum,
} from "@/utils/calendarUtils";
import { CalendarBodyWeek } from "@/components/CalendarWeek/CalendarBodyWeek";
import { CalendarBodyMonth } from "@/components/CalendarMonth/CalendarBodyMonth";
import { CalendarHeaderWeek } from "@/components/CalendarWeek/CalendarHeaderWeek";
import { CalendarHeaderMonth } from "@/components/CalendarMonth/CalendarHeaderMonth";

import { useSelector } from "react-redux";

const ev = [
    {
        title: "Meeting",
        start: new Date(2022, 3, 7, 10, 0),
        end: new Date(2022, 3, 7, 10, 30),
    },
    {
        title: "Coffee break",
        start: new Date(2022, 3, 12, 15, 45),
        end: new Date(2022, 3, 12, 16, 30),
    },
];

export const CalendarScreen = ({
    events = ev,
    height = 900,
    hourRowHeight,
    ampm = false,
    date,
    eventCellStyle,
    calendarCellStyle,
    calendarCellTextStyle,
    locale = "en",
    hideNowIndicator = false,
    showAdjacentMonths = true,
    // mode,
    overlapOffset,
    scrollOffsetMinutes = 0,
    showTime = true,
    headerContainerStyle = {},
    headerContentStyle = {},
    dayHeaderStyle = {},
    dayHeaderHighlightColor = "",
    weekDayHeaderHighlightColor = "",
    bodyContainerStyle = {},
    swipeEnabled = true,
    weekStartsOn = 0,
    onChangeDate,
    onPressCell,
    onPressDateHeader,
    onPressEvent,
    renderEvent,
    renderHeader: HeaderComponent = CalendarHeaderWeek,
    renderHeaderForMonthView: HeaderComponentForMonthView = CalendarHeaderMonth,
    weekEndsOn = 6,
    maxVisibleEventCount = 3,
    eventMinHeightForMonthView = 22,
    activeDate,
    headerComponent = null,
    moreLabel = "{moreCount} More",
    onSwipe,
}) => {
    const [targetDate, setTargetDate] = React.useState($dayjs(date));

    const mode = useSelector((state) => state.switchView);

    React.useEffect(() => {
        if (date) {
            setTargetDate($dayjs(date));
        }
    }, [date]);

    const allDayEvents = React.useMemo(
        () => events.filter((event) => isAllDayEvent(event.start, event.end)),
        [events]
    );

    const daytimeEvents = React.useMemo(
        () => events.filter((event) => !isAllDayEvent(event.start, event.end)),
        [events]
    );

    const dateRange = React.useMemo(() => {
        switch (mode) {
            case "month":
                return getDatesInMonth(targetDate, locale);
            case "week":
                return getDatesInWeek(targetDate, weekStartsOn, locale);
            case "3days":
                return getDatesInNextThreeDays(targetDate, locale);
            case "day":
                return getDatesInNextOneDay(targetDate, locale);
            case "custom":
                return getDatesInNextCustomDays(
                    targetDate,
                    weekStartsOn,
                    weekEndsOn,
                    locale
                );
            default:
                throw new Error(
                    `[react-native-big-calendar] The mode which you specified "${mode}" is not supported.`
                );
        }
    }, [mode, targetDate, locale, weekEndsOn, weekStartsOn]);

    // React.useEffect(() => {
    //   if (onChangeDate) {
    //     onChangeDate([dateRange[0].toDate(), dateRange.slice(-1)[0].toDate()])
    //   }
    // }, [dateRange, onChangeDate])

    const cellHeight = React.useMemo(() => {
        return hourRowHeight || Math.max(height - 30, MIN_HEIGHT) / 24;
    }, [height, hourRowHeight]);

    const onSwipeHorizontal = React.useCallback(
        (direction) => {
            if (!swipeEnabled) {
                return;
            }
            if (onSwipe) {
                onSwipe(direction);
            }

            if (
                (direction === "LEFT" && !theme?.isRTL) ||
                (direction === "RIGHT" && theme?.isRTL)
            ) {
                const date = targetDate.add(modeToNum(mode, targetDate), "day");
                setTargetDate(date);
                if (onChangeDate) {
                    onChangeDate([
                        date.clone().startOf("month").toDate(),
                        date.clone().endOf("month").toDate(),
                    ]);
                }
            } else {
                let date;
                if (mode === "month") {
                    date = targetDate.add(targetDate.date() * -1, "day");
                } else {
                    date = targetDate.add(modeToNum(mode, targetDate) * -1, "day");
                }
                setTargetDate(date);
                if (onChangeDate) {
                    onChangeDate([
                        date.clone().startOf("month").toDate(),
                        date.clone().endOf("month").toDate(),
                    ]);
                }
            }
        },
        [swipeEnabled, onSwipe, targetDate, mode, onChangeDate]
    );

    const commonProps = {
        cellHeight,
        dateRange,
        mode,
        onPressEvent,
    };

    if (mode === "month") {
        const headerProps = {
            style: headerContainerStyle,
            locale: locale,
            weekStartsOn: weekStartsOn,
            headerContentStyle: headerContentStyle,
            dayHeaderStyle: dayHeaderStyle,
            dayHeaderHighlightColor: dayHeaderHighlightColor,
            weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
        };
        return (
            <React.Fragment>
                <HeaderComponentForMonthView {...headerProps} targetDate={targetDate} />
                <CalendarBodyMonth
                    {...commonProps}
                    style={bodyContainerStyle}
                    containerHeight={height}
                    events={[...daytimeEvents, ...allDayEvents]}
                    eventCellStyle={eventCellStyle}
                    calendarCellStyle={calendarCellStyle}
                    calendarCellTextStyle={calendarCellTextStyle}
                    weekStartsOn={weekStartsOn}
                    hideNowIndicator={hideNowIndicator}
                    showAdjacentMonths={showAdjacentMonths}
                    onPressCell={onPressCell}
                    onPressDateHeader={onPressDateHeader}
                    onPressEvent={onPressEvent}
                    onSwipeHorizontal={onSwipeHorizontal}
                    renderEvent={renderEvent}
                    targetDate={targetDate}
                    maxVisibleEventCount={maxVisibleEventCount}
                    eventMinHeightForMonthView={eventMinHeightForMonthView}
                    moreLabel={moreLabel}
                />
            </React.Fragment>
        );
    }

    const headerProps = {
        ...commonProps,
        style: headerContainerStyle,
        allDayEvents: allDayEvents,
        onPressDateHeader: onPressDateHeader,
        activeDate,
        headerContentStyle: headerContentStyle,
        dayHeaderStyle: dayHeaderStyle,
        dayHeaderHighlightColor: dayHeaderHighlightColor,
        weekDayHeaderHighlightColor: weekDayHeaderHighlightColor,
    };

    return (
        <React.Fragment>
            <HeaderComponent {...headerProps} />
            <CalendarBodyWeek
                {...commonProps}
                style={bodyContainerStyle}
                containerHeight={height}
                events={daytimeEvents}
                eventCellStyle={eventCellStyle}
                calendarCellStyle={calendarCellStyle}
                hideNowIndicator={hideNowIndicator}
                overlapOffset={overlapOffset}
                scrollOffsetMinutes={scrollOffsetMinutes}
                ampm={ampm}
                showTime={showTime}
                onPressCell={onPressCell}
                onPressEvent={onPressEvent}
                onSwipeHorizontal={onSwipeHorizontal}
                renderEvent={renderEvent}
                headerComponent={headerComponent}
            />
        </React.Fragment>
    );
};
