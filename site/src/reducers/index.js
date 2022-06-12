import { combineReducers } from "redux";
import switchView from "./switchView";
import changeMonth from "./changeMonth"
import commands from "./commands";
import events from "./events";

import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({ switchView, commands, changeMonth, events })
);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
