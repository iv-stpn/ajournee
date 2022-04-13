import { combineReducers } from "redux";
import switchView from "./switchView";
import commands from "./commands";

import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({ switchView, commands })
);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
