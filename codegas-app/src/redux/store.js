import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers";

// Import thunk safely - handle different export formats
let thunk;
try {
  const thunkModule = require("redux-thunk");
  // Handle different export formats
  thunk = thunkModule.default || thunkModule.thunk || thunkModule;

  // Ensure it's actually a function
  if (typeof thunk !== 'function') {
    throw new Error('Redux-thunk is not a function');
  }
} catch (error) {
  console.warn('Redux-thunk not available, using fallback:', error);
  // Fallback thunk implementation
  thunk = store => next => action =>
    typeof action === 'function' ? action(store.dispatch, store.getState) : next(action);
}

const middlewares = [thunk];

// Debug middleware types
console.log('Thunk middleware type:', typeof thunk);
console.log('Thunk middleware:', thunk);

// React Native compatible development tools
let composeEnhancers = compose;

// Only add redux-logger in development and if it doesn't cause issues
if (__DEV__) {
  try {
    const { createLogger } = require("redux-logger");
    const logger = createLogger({
      collapsed: true,
      duration: true,
      timestamp: false,
      level: 'info',
      logErrors: false
    });

    // Ensure logger is also a function
    if (typeof logger === 'function') {
      middlewares.push(logger);
      console.log('Logger middleware added');
    } else {
      console.warn('Logger is not a function:', typeof logger);
    }
  } catch (error) {
    console.warn('Redux logger not available:', error);
  }
}

// Debug all middlewares
console.log('All middlewares:', middlewares.map(m => typeof m));

export default function configureStore() {
  const store = createStore(
    rootReducer,
    {},
    composeEnhancers(applyMiddleware(...middlewares))
  );

  return store;
}
