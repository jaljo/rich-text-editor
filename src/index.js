import './Style/Main.css'
import App from './Component/App';
import Cookies from 'universal-cookie'
import React from 'react';
import ReactDOM from 'react-dom';
import rootEpic from './Epic'
import { applyMiddleware, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { default as mainReducer, debug } from './Redux/State'
import createBrowserHistory from 'history/createBrowserHistory'
import { fetchApi } from './Util.js'
import CropperBox from './CropperBox'

const CropperJsBox   = CropperBox ([]);
const cookies        = new Cookies();
const history        = createBrowserHistory();
const location       = window.location;
const epicMiddleware = createEpicMiddleware({
  dependencies: {
    history,
    location,
    fetchApi: fetchApi(fetch, cookies),
    cookies,
    cropperBox: CropperJsBox,
    window: window,
  },
});
const middleware     = applyMiddleware(epicMiddleware);
const reducer        = Number(process.env.REACT_APP_DEBUG_STATE)
  ? debug(mainReducer)
  : mainReducer;
const store          = createStore(reducer, reducer(), middleware);

epicMiddleware.run(rootEpic);

ReactDOM.render(<App
  store={store}
  location={location}
  history={history}
/>, document.getElementById('root'));
