import './Style/Main.scss'
import {
  applyMiddleware,
  createStore,
} from 'redux'
import {
  debug,
  default as mainReducer,
} from './Redux/State'
import App from './Component/App'
import {
  createEpicMiddleware,
} from 'redux-observable'
import React from 'react'
import ReactDOM from 'react-dom'
import rootEpic from './Epic'

const defaultOptions = {
  headers: {},
  method: 'GET',
}

const fetchApi = (url, options = defaultOptions) => fetch(url, options)
  .then(response => response.json())
;

const epicMiddleware = createEpicMiddleware({
  dependencies: {
    fetchApi,
    window: window,
  },
});

const middleware = applyMiddleware(epicMiddleware);

const reducer = Number(process.env.REACT_APP_DEBUG_STATE)
  ? debug(mainReducer)
  : mainReducer
;

const store = createStore(reducer, reducer(), middleware);

epicMiddleware.run(rootEpic);

ReactDOM.render(<App store={store}/>, document.getElementById('root'));
