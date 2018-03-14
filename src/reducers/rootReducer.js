import { combineReducers } from "redux";
import info from './infoReducer';
import geocode from './geocodeReducer';

const rootReducer=combineReducers({
  info,
  geocode,
});

export default rootReducer;
