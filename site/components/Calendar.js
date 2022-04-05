import { View, Text, Image, Modal, Pressable,Dimensions } from "react-native";
import React ,{ useState }from "react";
import DatePicker from 'react-native-modern-datepicker';
import tw from '../Breakpoints'; // or, if no custom config: `from 'twrnc'`
import { useDeviceContext } from 'twrnc';
/* export default function Calendar() {
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
*/

export default function Calendar() {
    if(Dimensions.get('window').width<530){
        var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }else{
        var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    }
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
    // ----------------------------
    function getFirstDayOfMonth(zeroBasedMonthNum, fullYear) {
        var monthNames = months;
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
    // ------------
    const [date, setDate] = useState(`${new Date().getFullYear()} ${new Date().getMonth()+1}`);
    const [modalVisible, setModalVisible] = useState(false);
    // revoir la taille des photo ( responsive ou proportionnelle )
    // revoir le radius des photo
    // revoir le padding du view bg-slate-500
    // include icons 
    // include function to know the current day
    // revoir les responsives photos, styles, datapicker
    // faire le store
    useDeviceContext(tw);
    return(
        <View style={tw`w-full h-full`}>
            <View style={tw`flex flex-row justify-between items-center px-5 bg-slate-500`}>
                <View style={tw`flex flex-row justify-between items-center`}>
                    <Image
                    style={tw.style(`rounded-full`,{
                        resizeMode: "center",
                        height: 50,
                        width: 50,
                      })}
                    source={{uri:'https://wallpapersmug.com/download/3840x2400/0e3ca6/deadpool-marvel-comics-minimal-4k.jpg'}}/>
                    <Text style={tw`text-white pl-5`}>{months[date.split(" ")[1]-1]}</Text>
                </View>
                <View>
                    <Pressable
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={tw`lg:text-white sm:text-red-500 md:text-slate-400`}>{date.split(" ")[0]}</Text>
                    </Pressable>
                </View>
            </View>
            <View style={tw`h-full`}>
                <Modal
                    animationType="slide" transparent={true} visible={modalVisible}
                >
                    <DatePicker
                        mode="monthYear"
                        current={date}
                        selectorStartingYear={2000}
                        onMonthYearChange={selectedDate => {setDate(selectedDate), setModalVisible(!modalVisible),console.log(selectedDate)}}
                        options={{
                            backgroundColor: '#090C08',
                            textHeaderColor: '#FFA25B',
                            textDefaultColor: '#F6E7C1',
                            selectedTextColor: '#fff',
                            mainColor: '#F4722B',
                            textSecondaryColor: '#D6C7A1',
                            borderColor: 'rgba(122, 146, 165, 0.1)',
                        }}
                        style={tw`rounded rounded-5 w-90 h-90 mx-auto my-auto`}
                    />
                </Modal>
                <View style={tw``}>
                    <View style={tw`flex flex-row h-1/7 justify-center items-center`}>
                        {days.map((day, i) => (
                            <Text key={i} style={tw`text-white text-center w-1/7`}>
                                {day}
                            </Text>
                        ))}
                    </View>
                    {test3(1, 2020).map((week, i) => (
                        <View style={tw`flex flex-row w-full h-1/7 h-`} key={i}>
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
            </View>
        </View>
    );
}
