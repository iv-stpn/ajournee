import dayjs from "dayjs";

const monthNames =
    "(?<monthName>ja(?:nvier)?|fe(?:vrier)?|mar(?:s)?|av(?:ril)?|mai|juin|juil(?:let)?|ao(?:ut)?|se(?:ptembre)?|oc(?:tobre)?|no(?:vembre)?|de(?:cembre)?)"; // return 3-4 letter month

const day = "(?:le )?(?:(?<day>[1-2]\\d|30|31|(?:0)?\\d)(?:er)?)"; // return a number
const month = monthNames + "|(?<month>10|11|12|(?:0)?\\d)"; // return 2-4 letter month
const year = "(?<year>\\d{4})"; // return 4 digit year
const time =
    "(?:a )?(?<hour>\\d{1,2})(?:h(?: et )?|:|)(?<minute>\\d{1,2})?(?:(?: )?min(?:ute(?:s)?)?)?"; // return hour and minute

const sep = "(:?,)?[-\\/ .\\\\,~'\"_|]";

const dateRegex = `${day}(?:${sep}?(?:${month})(?:${sep}?${year})?)?(?:${sep}?(?:${time}))?`;

const matchFirst = (regex, text) => {
    const match = regex.exec(text);
    regex.lastIndex = 0;
    return match;
};

const months = [
    "ja",
    "fe",
    "mar",
    "av",
    "mai",
    "juin",
    "juil",
    "au",
    "se",
    "oc",
    "no",
    "de",
];

const removeDiacritics = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getMonthFromMonthName = (monthName) => {
    for (let i = 2; i <= 4; i++) {
        if (months.includes(monthName.slice(0, i))) {
            return months.indexOf(monthName.slice(0, i));
        }
    }
    throw `Unexpected: Mois invalide '${monthName}'`;
};

const getDay = (day, month, year) => {
    const date = dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD");
    if (!date.isValid()) throw `La date ${day}/${month}/${year} n'est pas valide`;
    return date;
};

const getNearestFutureMonth = (day) => {
    const date = dayjs();

    const currentDay = date.get("date");
    if (day > currentDay) {
        return date.get("month");
    }
    return date.add(1, "month").get("month");
};

const getNearestFutureYear = (day, month) => {
    const date = dayjs();
    const currentMonth = date.get("month") - 1;
    const currentDay = date.get("date");
    if (month > currentMonth || (month === currentMonth && day > currentDay)) {
        return date.get("year");
    }
    return date.add(1, "year").get("year");
};

const matchDate = (groups) => {
    console.log("MATCH DATE", groups);
    const day = parseInt(groups.day);
    const month = groups.month
        ? parseInt(groups.month)
        : groups.monthName
        ? getMonthFromMonthName(groups.monthName) + 1
        : getNearestFutureMonth(day) + 1;

    console.log("MONTH", month, getNearestFutureMonth(day));
    const year = groups.year ?? getNearestFutureYear(day, month);
    const date = getDay(day, month, year);

    if (groups.hour) {
        const hour = groups.hour;
        const minute = groups.minute ?? 0;
        return date.set("hour", hour).set("minute", minute);
    }

    return date;
};

export const getDate = (text) => {
    const match = matchFirst(new RegExp(dateRegex, "i"), removeDiacritics(text));
    if (!match) return null;
    const date = matchDate(match.groups);
    return date;
};
