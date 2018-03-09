import { combineReducers } from "redux";
import info from './infoReducer';
import geocode from './geocodeReducer';
import userLocation from './userLocationReducer';

const rootReducer=combineReducers({
  info,
  geocode,
  userLocation,
});

export default rootReducer;
