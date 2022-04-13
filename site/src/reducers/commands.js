export default (state = [], action) => {
    switch (action.type) {
        case "ADD_COMMAND":
            return [...state, action.text];
        case "REMOVE_COMMAND":
            return state.filter((_, idx) => idx !== action.index);
        default:
            return state;
    }
};
