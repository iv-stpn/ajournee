import { CHAT_INPUT_MARGIN_X, outlineNone } from "@/styles/commonStyles";
import { useState } from "react";
import { TextInput } from "react-native";

import { useDispatch } from "react-redux";

import tw from "twrnc";

export default () => {
    const dispatch = useDispatch();
    const [text, setText] = useState("");

    return (
        <TextInput
            value={text}
            onChangeText={(text) => setText(text)}
            onSubmitEditing={() => (dispatch({ type: "ADD_COMMAND", text }), setText(""))}
            placeholder="Entrez votre commande !"
            style={{
                fontFamily: "Montserrat",
                ...tw`h-full w-full mb-[2px] text-white border-0 text-base px-2 py-3`,
                ...outlineNone,
                marginHorizontal: CHAT_INPUT_MARGIN_X,
            }}
            placeholderTextColor="#ddd"
            blurOnSubmit={false}
        />
    );
};
