import { $dayjs, todayInMinutes } from "@/utils/calendarUtils";
import React from "react";
import { TouchableOpacity, Text } from 'react-native'
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
import DatePicker from "react-native-modern-datepicker";
import tw from "twrnc";
import { useDispatch, useSelector } from "react-redux";
import { Colors, IconButton } from "react-native-paper";
import { View } from "react-native-web";


// const ev = 

export const CalendarScreen = ({
    events = useSelector( state => state.events),
    height = 900,
    hourRowHeight,
    ampm = false,
    // date,
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
    
    const date = useSelector((state) => state.changeMonth); 
    
    const mode = useSelector((state) => state.switchView);
    const dispatch = useDispatch();
    const [targetDate, setTargetDate] = React.useState($dayjs(date));
    
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
            case "picker": break;
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
                <View
                    style = {tw`w-full flex items-center`}
                >
                    <TouchableOpacity 
                    onPress={
                        mode === "picker" ? () => {} : () => dispatch({ type: "SWITCH_MONTHYEAR" })
                    }
                    style = {tw`w-20`}
                    >
                        <Text
                        style = {tw `nohover:underline text-indigo-500 text-center text-xl`}
                        >
                            { new Date(date).toLocaleString('default', { month: 'long' }) }
                        </Text>
                    </TouchableOpacity>
                </View>
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
    
    if( mode === "picker"){
        return (
        <View style = {tw`h-full w-full flex flex-col`}>
            <IconButton
                icon={"close-circle"}
                color={mode === "picker" ? Colors.blue500 : Colors.grey500}
                onPress={
                    mode === "month" ? () => {} : () => dispatch({ type: "SWITCH_MONTH" })
                }
                style = {tw`w-full float-right`}
            />
            <DatePicker
                style = { tw`h-full w-full` }
                options = { 
                {
                    backgroundColor: Colors.transparent,
                    textHeaderColor: Colors.blue500,
                    textDefaultColor: Colors.grey500,
                    textHeaderFontSize: 20,
                    textFontSize: 20,
                    
                }
                        }
                        mode = "monthYear"
                current= { date }
                selected = { date }
                onMonthYearChange={ (selectedDate) => { dispatch({ type : "UPDATE_MONTHYEAR" , monthYear: selectedDate })}}
            />
        </View>
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
