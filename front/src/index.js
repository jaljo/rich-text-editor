import './Style/Main.scss'
import App from './Component/App'
import React from 'react'
import ReactDOM from 'react-dom'
import rootEpic from './Epic'
import { applyMiddleware, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { default as mainReducer, debug } from './Redux/State'

const defaultOptions = {
  method: 'GET',
  headers: {},
}

const fetchApi = (url, options = defaultOptions) => fetch(url, options)
  .then(response => response.json())
;

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    window: window,
    fetchApi,
  },
});
const middleware = applyMiddleware(epicMiddleware);
const reducer = Number(process.env.REACT_APP_DEBUG_STATE)
  ? debug(mainReducer)
  : mainReducer;
const store = createStore(reducer, reducer(), middleware);

epicMiddleware.run(rootEpic);

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
