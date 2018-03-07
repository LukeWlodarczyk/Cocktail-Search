import React from "react";
import { render } from "react-dom";
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore'
import { Provider } from "react-redux";
import App from './App';
import style from './style.css';

const store = configureStore();
 
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
