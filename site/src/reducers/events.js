const ev = [
    {
        title: "Meeting",
        start: new Date(2022, 3, 7, 10, 0),
        end: new Date(2022, 3, 7, 10, 30),
    },
    {
        title: "Coffee break",
        start: new Date(2022, 3, 12, 15, 45),
        end: new Date(2022, 3, 12, 16, 30),
    },
    {
        title: "Mentoring",
        start: new Date(2022, 9, 22, 15, 45),
        end: new Date(2022, 9, 22, 16, 30),
    },
];

export default (state = ev, action) => {
    switch(action.type){
        case "STORE_EVENT":
            return [...state, ...action.events]
        default: 
            return state;
    }
}       