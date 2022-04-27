//TODO getters :
            //get an or all events
            // get events by date, user, type, title / content , etc...
        // actions :
            // del event by type and date and others filters 
// function to filter data to render : start , end, type , data , users , etc...

export default (state = [], action) => {
    switch (action.type) {
        case "ADD_EVENT":
            // clean action text to render event title , start , end
            return [...state, { title : action.start, start: action.end, end: action.title }];
            
        case "REMOVE_EVENT":
            return state.filter((_, idx) => idx !== action.index);

        case "MODIFY_EVENT":
            
            if (state == [] || state.indexOf(action.index) == -1) {
                return [...state];
            }else{
               let copy = [...state];
               copy[state.indexOf(action.index)] = action.text;
               return copy;
            }
        default:
            return state;
    }
};


