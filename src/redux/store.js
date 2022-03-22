import { createStore, combineReducers } from "redux";
import { CollApsedReducer } from "./reducers/CollapsedReducer";
import { LoadingReducer } from "./reducers/LoadingReducer";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
    key: 'root', //localstorage中的标识
    storage,
    blacklist:['LoadingReducer']  //不会被持久化的黑名单
}
const reducer = combineReducers({
    CollApsedReducer,//折叠侧边栏
    LoadingReducer//loading显示与否
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export {
    store,
    persistor
}