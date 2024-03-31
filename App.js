import MainNavigator from './Navigations/Navigation'
import React,{useState} from 'react';
import { createStore , combineReducers , applyMiddleware} from 'redux'
import getData from './store/reducers/getData';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import * as SQLite from 'expo-sqlite'
const db = SQLite.openDatabase('sql.db')

const rootReducer = combineReducers({
  productName : getData,
})


const store = createStore(rootReducer,applyMiddleware(ReduxThunk))

export default function App() {

      
      return (
        <Provider store={store}>
          <MainNavigator />
        </Provider>
      );
    
      
}

