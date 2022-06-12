
let today = new Date()
export default (state = today.getFullYear()+'/'+today.getMonth()+'/'+today.getDay(), action) => {
    switch(action.type)
    {
        case "UPDATE_MONTHYEAR":
            return action.monthYear.split(' ')[0]+'/'+action.monthYear.split(' ')[1]+'/'+"01";
            break;
        default: 
            return state;
    }
}