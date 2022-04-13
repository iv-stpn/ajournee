import moment from "moment";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(duration);
dayjs.extend(isBetween);

export const $dayjs = dayjs;

export const DAY_MINUTES = 1440;

export function getDatesInMonth(date = new Date(), locale = "en") {
    const subject = dayjs(date);
    const days = Array(subject.daysInMonth() - 1)
        .fill(0)
        .map((_, i) => {
            return subject.date(i + 1).locale(locale);
        });
    return days;
}

export function getDatesInWeek(date = new Date(), weekStartsOn = 0, locale = "en") {
    const subject = dayjs(date);
    const subjectDOW = subject.day();
    const days = Array(7)
        .fill(0)
        .map((_, i) => {
            return subject
                .add(
                    i -
                        (subjectDOW < weekStartsOn ? 7 + subjectDOW : subjectDOW) +
                        weekStartsOn,
                    "day"
                )
                .locale(locale);
        });
    return days;
}

export function getDatesInNextThreeDays(date = new Date(), locale = "en") {
    const subject = dayjs(date).locale(locale);
    const days = Array(3)
        .fill(0)
        .map((_, i) => {
            return subject.add(i, "day");
        });
    return days;
}

export function getDatesInNextOneDay(date = new Date(), locale = "en") {
    const subject = dayjs(date).locale(locale);
    const days = Array(1)
        .fill(0)
        .map((_, i) => {
            return subject.add(i, "day");
        });
    return days;
}

export const hours = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];

export function formatHour(hour, ampm = false) {
    if (ampm) {
        if (hour === 0) {
            return "";
        }
        if (hour === 12) {
            return `12 PM`;
        }
        if (hour > 12) {
            return `${hour - 12} PM`;
        }
        return `${hour} AM`;
    }
    return `${hour}:00`;
}

export function isToday(date) {
    const today = dayjs();
    return today.isSame(date, "day");
}

export function getRelativeTopInDay(date) {
    return (100 * (date.hour() * 60 + date.minute())) / DAY_MINUTES;
}

export function todayInMinutes() {
    const today = dayjs();
    return today.diff(dayjs().startOf("day"), "minute");
}

export function modeToNum(mode, current) {
    if (mode === "month") {
        if (!current) {
            throw new Error("You must specify current date if mode is month");
        }
        if (current instanceof Date) {
            current = dayjs(current);
        }
        return current.daysInMonth() - current.date() + 1;
    }
    switch (mode) {
        case "day":
            return 1;
        case "3days":
            return 3;
        case "week":
        case "custom":
            return 7;
        default:
            throw new Error("undefined mode");
    }
}

export function formatStartEnd(start, end, format) {
    return `${dayjs(start).format(format)} - ${dayjs(end).format(format)}`;
}

export function isAllDayEvent(start, end) {
    const _start = dayjs(start);
    const _end = dayjs(end);

    return (
        _start.hour() === 0 &&
        _start.minute() === 0 &&
        _end.hour() === 0 &&
        _end.minute() === 0
    );
}

export function getCountOfEventsAtEvent(event, eventList) {
    return eventList.filter(
        (e) =>
            dayjs(event.start).isBetween(e.start, e.end, "minute", "[)") ||
            dayjs(e.start).isBetween(event.start, event.end, "minute", "[)")
    ).length;
}

export function getOrderOfEvent(event, eventList) {
    const events = eventList
        .filter(
            (e) =>
                dayjs(event.start).isBetween(e.start, e.end, "minute", "[)") ||
                dayjs(e.start).isBetween(event.start, event.end, "minute", "[)")
        )
        .sort((a, b) => {
            if (dayjs(a.start).isSame(b.start)) {
                return dayjs(a.start).diff(a.end) < dayjs(b.start).diff(b.end) ? -1 : 1;
            } else {
                return dayjs(a.start).isBefore(b.start) ? -1 : 1;
            }
        });
    const index = events.indexOf(event);
    return index === -1 ? 0 : index;
}

export function getDatesInNextCustomDays(
    date = new Date(),
    weekStartsOn = 0,
    weekEndsOn = 6,
    locale = "en"
) {
    const subject = dayjs(date);
    const subjectDOW = subject.day();
    const days = Array(weekDaysCount(weekStartsOn, weekEndsOn))
        .fill(0)
        .map((_, i) => {
            return subject.add(i - subjectDOW + weekStartsOn, "day").locale(locale);
        });
    return days;
}

// TODO: This method should be unit-tested
function weekDaysCount(weekStartsOn, weekEndsOn) {
    // handle reverse week
    if (weekEndsOn < weekStartsOn) {
        let daysCount = 1;
        let i = weekStartsOn;
        while (i !== weekEndsOn) {
            ++i;
            ++daysCount;
            if (i > 6) {
                i = 0;
            }
            // fallback for infinite
            if (daysCount > 7) {
                break;
            }
        }
        return daysCount;
    }
    // normal week
    if (weekEndsOn > weekStartsOn) {
        return weekEndsOn - weekStartsOn + 1;
    }
    // default
    return 1;
}

export function getEventSpanningInfo(
    event,
    date,
    dayOfTheWeek,
    calendarWidth,
    showAdjacentMonths
) {
    const dayWidth = calendarWidth / 7;

    // adding + 1 because durations start at 0
    const eventDuration =
        Math.floor(dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).asDays()) +
        1;
    const eventDaysLeft =
        Math.floor(dayjs.duration(dayjs(event.end).diff(date)).asDays()) + 1;
    const weekDaysLeft = 7 - dayOfTheWeek;
    const monthDaysLeft = date.endOf("month").date() - date.date();
    const isMultipleDays = eventDuration > 1;
    // This is to determine how many days from the event to show during a week
    let eventWeekDuration =
        eventDaysLeft < weekDaysLeft
            ? eventDaysLeft
            : eventDuration > weekDaysLeft
            ? weekDaysLeft
            : eventDuration;
    if (!showAdjacentMonths && monthDaysLeft < 7 && monthDaysLeft < eventDuration) {
        eventWeekDuration = monthDaysLeft + 1;
    }
    const isMultipleDaysStart =
        isMultipleDays &&
        (date.isSame(event.start, "day") ||
            (dayOfTheWeek === 0 && date.isAfter(event.start)) ||
            (!showAdjacentMonths && date.get("date") === 1));
    // - 6 to take in account the padding
    const eventWidth = dayWidth * eventWeekDuration - 6;

    return { eventWidth, isMultipleDays, isMultipleDaysStart, eventWeekDuration };
}

export function getNonVisibleMonthEventsCount(
    beforeEvents,
    events,
    date,
    dayOfTheWeek,
    showAdjacentMonths,
    maxVisibleEventCount
) {
    let count = 0;
    events.forEach((event, i) => {
        const eventDuration =
            Math.floor(
                dayjs.duration(dayjs(event.end).diff(dayjs(event.start))).asDays()
            ) + 1;
        const isMultipleDays = eventDuration > 1;
        const isMultipleDaysStart =
            isMultipleDays &&
            (date.isSame(event.start, "day") ||
                (dayOfTheWeek === 0 && date.isAfter(event.start)) ||
                (!showAdjacentMonths && date.get("date") === 1));
        if (isMultipleDays && !isMultipleDaysStart) {
            if (beforeEvents && i <= maxVisibleEventCount) {
                const index = beforeEvents.findIndex((e) => e.id === event.id);
                if (
                    index > -1 &&
                    (index > maxVisibleEventCount || beforeEvents[index].isNotVisible)
                ) {
                    event.isNotVisible = true;
                    count += 1;
                }
            } else if (i > maxVisibleEventCount) {
                event.isNotVisible = true;
            }
        }
    });

    return count;
}

export function objHasContent(obj) {
    return !!Object.keys(obj).length;
}

export function stringHasContent(string) {
    return !!string.length;
}

export function getWeeksWithAdjacentMonths(targetDate, nWeeks, weekStartsOn = 0) {
    // Get the week of the target date, starting on sunday, then the nWeeks-1 following weeks

    const startDay = moment(targetDate.$d).startOf("month");

    return [...Array(nWeeks).keys()].map((week) =>
        [...[...Array(7).keys()].map((i) => i + weekStartsOn)].map((day) => {
            return startDay
                .clone()
                .add(7 * week, "day")
                .day(day);
        })
    );

    const weeks = [];

    for (let i = 0; i < nWeeks; i++) {
        const week = [];
        for (let j = weekStartsOn; j < 7 + weekStartsOn; j++) {
            week.push(moment(targetDate).day(j));
        }
        weeks.push(week);
    }

    return weeks;

    // let weeks = calendarize(targetDate.toDate(), weekStartsOn);
    // const firstDayIndex = weeks[0].findIndex((d) => d === 1);
    // const lastDay = targetDate.endOf("month").date();
    // const lastDayIndex = weeks[weeks.length - 1].findIndex((d) => d === lastDay);

    // weeks = weeks.map((week, iw) => {
    //     return week.map((d, id) => {
    //         if (d !== 0) {
    //             return d;
    //         } else if (iw === 0) {
    //             return d - (firstDayIndex - id - 1);
    //         } else {
    //             return lastDay + (id - lastDayIndex);
    //         }
    //     });
    // });

    // return weeks;
}
