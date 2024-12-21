import { configureStore } from '@reduxjs/toolkit'
import popupReducer from './popup/popupSlice'
import authReducer from './auth/authSlice'
import courseReducer from './course/courseSlice'
import chapterReducer from './chapter/chapterSlice'

import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

import { Persistor } from 'redux-persist/es/types'
// Config redux persist
const persistConfig = {
  key: 'elearn/admin',
  storage
}
const userConfig = {
  ...persistConfig,
  whitelist: ['isLogin', 'userInfo']
}

const store = configureStore({
  reducer: {
    popup: popupReducer,
    chapter: chapterReducer,
    course: courseReducer,
    auth: persistReducer<ReturnType<typeof authReducer>>(userConfig, authReducer)
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const persistor: Persistor = persistStore(store)
export { store, persistor }
