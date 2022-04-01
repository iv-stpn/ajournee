import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

export default function Calendar() {
    function getFirstDayOfMonth(zeroBasedMonthNum, fullYear) {
        var monthNames = [
            "January",
            "Febuary",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        var dateStr = `${monthNames[zeroBasedMonthNum]} 1, ${fullYear}, 00:00:00`;
        var monthStart = new Date(dateStr);
        return monthStart;
    }

    function daysInMonth(zeroBasedMonthNumber) {
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return days[zeroBasedMonthNumber];
    }

    function MonthDay(number, isThisMonth) {
        this.day = number;
        this.thisMonth = isThisMonth;
        return this;
    }

    function chunkArrayInGroups(arr, size) {
        var myArray = [];
        for (var i = 0; i < arr.length; i += size) {
            myArray.push(arr.slice(i, i + size));
        }
        return myArray;
    }

    function test3(monthIndex, year) {
        var firstDay = getFirstDayOfMonth(monthIndex, year).getDay();
        if (firstDay == 0) firstDay = 6;
        else firstDay--;

        var daysFromLastMonth = firstDay;
        var result = [];

        var daysInLastMonth = daysInMonth(monthIndex - 1);
        var first = daysInLastMonth - daysFromLastMonth + 1;
        console.log(first);
        for (var i = 0; i < daysFromLastMonth; i++) {
            //result.push(first+i);
            result.push(new MonthDay(first + i, false));
        }

        for (var i = 1; i <= daysInMonth(monthIndex); i++)
            //result.push( i );
            result.push(new MonthDay(i, true));

        var daysDone = result.length;
        var daysToGo = 6 * 7 - daysDone;
        for (var i = 1; i <= daysToGo; i++)
            //result.push( i );
            result.push(new MonthDay(i, false));

        return chunkArrayInGroups(result, 7);
    }

    return (
        <View style={tw`h-full`}>
            <View style={tw`flex flex-row h-1/7 justify-center items-center`}>
                {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ].map((day, i) => (
                    <Text key={i} style={tw`text-white text-center w-1/7`}>
                        {day}
                    </Text>
                ))}
            </View>
            {test3(1, 2020).map((week, i) => (
                <View style={tw`flex flex-row w-full h-1/7`} key={i}>
                    {week.map((day, j) => (
                        <Text
                            key={j}
                            style={tw`p-2 text-white border border-gray-600 w-1/7`}
                        >
                            {day.day}
                            {day.thisMonth ? "*" : ""}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
}
