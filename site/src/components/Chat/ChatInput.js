import { CHAT_INPUT_MARGIN_X, outlineNone } from "@/styles/commonStyles";
import { useState } from "react";
import { TextInput } from "react-native";

import { useDispatch } from "react-redux";

import tw from "twrnc";

export default () => {
    const dispatch = useDispatch();
    const [text, setText] = useState("");
    const [isActive, setActive] = useState(false);
    return (
        <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            onSubmitEditing={() => (dispatch({ type: "ADD_COMMAND", text }), setText(""))}
            placeholder="Entrez votre commande !"
            style={{
                ...tw`h-full w-full rounded-md text-white text-base px-2 py-3`,
                ...outlineNone,
                borderColor: isActive ? '#2382d8' : '#424656',
                borderWidth: 2,
                fontFamily: "Montserrat",
                backgroundColor: "#424656"
            }}
            placeholderTextColor="#ddd"
            blurOnSubmit={false}
            onFocus={() => setActive(true)} onBlur={() => setActive(false)}
        />
    );
};
