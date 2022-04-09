import { createSlice, configureStore } from '@reduxjs/toolkit'
import { createStore } from 'redux'
import axios from 'axios'

// revoir la structure de l'initial state
// revoir les fonctions a ajouter au reducer
// ajouter des endpoints
// revoir les mutations ( certains doivent etre dans d'autres)
// localstorage 
// front state

const useAPI = false;

const EventSlice = createSlice({
    name: 'Event',
    state:{
        Events: [],
        Commands: [],
    },
    reducers: {

      addEvent: async (eventItem)=>{
        // use api if useAPI is true or use localstorage if useAPI is false
        // const promise = useAPI ? axios.post('http://localhost:3000/api/events', eventItem) : localStorage.setItem(eventItem.id, JSON.stringify(eventItem));
        return await axios.post(`/Events/${eventItem.type}`, eventItem)
        .then((res,state) => {
          return state.Events = res.data;
        })
        .catch((error) => {console.log(error)})

        /*
        
        return await axios.post(`/Events/${eventItem.type}`, eventItem)
        .then((state) => {
          return state.Events.push(eventItem);
        })
        .catch((error) => {console.log(error)})
        
        */
      },
      
      deleteEvent: async (eventItem)=>{
        return await axios.delete(`/Events/${eventItem.type}/${eventItem.id}`)
        .then((res,state) => {
          return state.Events = res.data;
        })
        .catch((error) => {console.log(error)})
      },

      
      updateEvent: async (eventItem)=>{
        return await axios.patch(`/Events/${eventItem.type}/${eventItem.id}`, eventItem)
        .then((res,state) => {
          return state.Events = res.data;
        })
        .catch((error) => {console.log(error)})
      },


      reportEvent:"",


      getAnEvent: async (eventItem)=>{
        return await axios.get(`/Events/${eventItem.type}/${eventItem.id}`)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {console.log(error)})
      },


      getCategoricalEvent:"",


      getAllEvents:async ()=>{
         
        return await axios.get(`/Events`)
        .then((res,state) => {
          return state.Events = res.data;
        })
        .catch((error) => {console.log(error)})
      },


      getPreviousCommand: (state) => state.Commands[-1],


      getAllCommands:async ()=>{
         
        return await axios.get(`/Commands`)
        .then((res,state) => {
          return state.Commands = res.data;
        })
        .catch((error) => {console.log(error)})
      },


      addCommand: async (CommandItem)=>{
        
        return await axios.post(`/Commands`, CommandItem)
        .then((res,state) => {
          return state.Commands = res.data;
        })
        .catch((error) => {console.log(error)})
      },

      refreshState: async (state)=>{
        state.Events = [];
        state.Commands = [];
      },
    }
  });

  

export const { addEvent,
              deleteEvent,
              updateEvent,
              reportEvent,
              getAnEvent,
              getCategoricalEvent,
              getAllEvents,
              getPreviousCommand,
              getAllCommands,
              addCommand  } = counterSlice.actions

const Eventstore = configureStore({
  reducer: EventSlice.reducer
})