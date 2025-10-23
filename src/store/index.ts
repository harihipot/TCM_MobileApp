import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas/index";
import rootReducer from "./reducers";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // stateReconciler: autoMergeLevel2,
  // whitelist: ['someReducer'], // optional: only persist specific reducers
  // blacklist: ['anotherReducer'], // optional: don't persist specific reducers
};

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer
);

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      // Raise warnAfter slightly to avoid noisy warnings in dev when serializable checks
      // take longer for large state/actions. See:
      // https://redux-toolkit.js.org/api/getDefaultMiddleware
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 64, // ms (default 32) - safe for dev only
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);
export default store;
