import React from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import tw from "twrnc";

import { IconButton, Colors } from "react-native-paper";
import { Header } from "@/components/App/Navigation/Header";
import dayjs from "dayjs";
import DatePicker from "react-native-modern-datepicker";

const AgendaSwitch = () => {
    const dispatch = useDispatch();
    const mode = useSelector((state) => state.switchView);
    
    return (
        <View style={tw`justify-end flex-row flex-1`}>
            <IconButton
                icon={"calendar-week"}
                color={mode === "week" ? Colors.blue500 : Colors.grey500}
                onPress={
                    mode === "week" ? () => {} : () => dispatch({ type: "SWITCH_WEEK" })
                }
            />
            <IconButton
                icon={"calendar-month"}
                color={mode === "month" ? Colors.blue500 : Colors.grey500}
                onPress={
                    mode === "month" ? () => {} : () => dispatch({ type: "SWITCH_MONTH" })
                }
            />
            {/* <IconButton
                icon={"calendar-month-outline"}
                color={mode === "picker" ? Colors.blue500 : Colors.grey500}            
            /> */}
        </View>
    );
};

export const AgendaTabHeader = ({ ...props }) => {
    return (
        <Header {...props}>
            <AgendaSwitch />
        </Header>
    );
};
