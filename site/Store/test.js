import { Pressable,View, Text } from 'react-native'
import React, { useState} from 'react'

import { createSlice, configureStore } from '@reduxjs/toolkit'

import tw from 'twrnc';



const EventSlice = createSlice({
    name: 'Events',
    initialState: {
        Events: [],
        Commands: [],
    },
    reducers: {
        addEvent: async (state, newState)=> {
            try{
                console.log(newState,"hhhhhhhhhhhhhhh")
                
                await AsyncStorage.setItem("Events", JSON.stringify(state)).then(()=> console.log("Data saved"));
                state.Events = newState.payload;
            }
            catch(error){
                console.log("error , data not saved");
            }
        },
        getEvents: async () => {
                await AsyncStorage.getItem("Events").then((data)=> console.log(JSON.parse(data)));
            
        },
        getAnEvent: ()=>{
            allEvents = getEvents();
            eventWanted = 0;
            return eventWanted;
        },
        
    }
});

export const { 
    addEvent,
    getEvents,
    getAnEvent,
    } = EventSlice.actions

const Eventstore = configureStore({
reducer: EventSlice.reducer
})



const Test = () => {
  
  const [messages, setMessages] = useState([1,2,3,4]);
  
  
  return( 
    <View>
        <View>
        {messages.map((message,j) => (
            <Text key={j} style={tw`text-white w-1/2 px-7 border-solid rounded ml-3 my-5 text-md`}>le message est : {message}</Text>
        ))}
        </View>
        <Pressable style={tw`bg-indigo-500 w-1/3 px-4 rounded mx-auto text-center py-2`} onPress={()=>{
             setMessages([...messages,messages.length+1]);
            }}>
                <Text style={tw`text-white`} > Get new State</Text>
        </Pressable>
    </View>
  )
}

export default Test