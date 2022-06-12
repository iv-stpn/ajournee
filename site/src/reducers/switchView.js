export default (state = "week", action) => {
    switch (action.type) {
        case "SWITCH_WEEK":
            return "week";
        case "SWITCH_MONTH":
            return "month";
        case "SWITCH_MONTHYEAR":
            return "picker";
        default:
            return state;
    }
};
