import { getDate } from "@/utils/chatUtils";

export default (state = [], action) => {
    switch (action.type) {
        case "ADD_COMMAND":
            const date = getDate(action.text);
            if (date) {
                return [
                    ...state,
                    action.text,
                    `La date ${date.format("llll")} a été entrée`,
                ];
            } else {
                return [...state, action.text];
            }
        case "REMOVE_COMMAND":
            return state.filter((_, idx) => idx !== action.index);
        default:
            return state;
    }
};
