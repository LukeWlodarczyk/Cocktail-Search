import { takeLatest, select, call, put, fork, all } from 'redux-saga/effects';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { fetchWeather, fetchDistance, fetchPlaces } from './apiCalls';
import {
  GET_INFO_REQUESTED,
  GET_INFO_SUCCESS,
  GET_INFO_FAILED,
  GET_GEOCODE,
  GET_GEOCODE_REQUESTED,
  GET_GEOCODE_SUCCESS,
  GET_GEOCODE_FAILED
} from '../constants/action-types';

function* getGeocode(action) {
  try {
    yield put({ type: GET_GEOCODE_REQUESTED });
    const destResult = yield call(geocodeByAddress, action.payload.destination);
    const userLocResult = yield call(geocodeByAddress, action.payload.userLocation);
    const dest = yield call(getLatLng, destResult[0]);
    const userLoc = yield call(getLatLng, userLocResult[0]);
    const geocodeDest = { ...dest, name: action.payload.destination };
    const geocodeUserLoc = { ...userLoc, name: action.payload.userLocation };
    yield put({type: GET_GEOCODE_SUCCESS, payload: { dest: geocodeDest, userLoc: geocodeUserLoc }});
  } catch(error) {
    yield put({type: GET_GEOCODE_FAILED, payload: error })
  }
}


function* getWeather(geocode) {
  try {
    yield put({type: GET_INFO_REQUESTED, loading: { weather: true}, error: { weather: null } });
    const weather = yield call(fetchWeather, geocode)
    yield put({type: GET_INFO_SUCCESS, payload: { weather }, loading: { weather: false }});
  } catch (error) {
    yield put({type: GET_INFO_FAILED, error:{ weather: error }, loading: { weather: false } });
  }
}


function* getDistance(geocode) {
  try {
    const { destination, userLocation } = geocode;
    yield put({type: GET_INFO_REQUESTED, loading: { distance: true }, error:{ distance: null } });
    const distance = yield call(fetchDistance, userLocation, destination)
    yield put({type: GET_INFO_SUCCESS, payload:{ distance }, loading: { distance: false }});
  } catch (error) {
    yield put({type: GET_INFO_FAILED, error:{ distance: error }, loading: { distance: false }});
  }
}

function* getPlaces(dest, placeType, query) {
  try {
    yield put({type: GET_INFO_REQUESTED, loading: { [placeType]: true }, error:{ [placeType]: null } });
    const data = yield call(fetchPlaces, dest, placeType, query)
    yield put({type: GET_INFO_SUCCESS, payload:{ [placeType]: data }, loading: { [placeType]: false }});
  } catch (error) {
    yield put({type: GET_INFO_FAILED, error:{ [placeType]: error }, loading: { [placeType]: false }});
  }
}

function* getInfo() {
  const geocode = yield select(state => state.geocode);
  const { destination: dest } = geocode;
  yield fork(getWeather, dest);
  yield fork(getDistance, geocode);
  // yield fork(getPlaces, dest, 'cafe', 'cafe');
  // yield fork(getPlaces, dest, 'restaurant', 'restaurant');
  // yield fork(getPlaces, dest, 'bar', 'bar');
  // yield fork(getPlaces, dest, 'lodging', 'lodging, hotel');
  // yield fork(getPlaces, dest, 'shopping_mall', 'shopping mall');
  // yield fork(getPlaces, dest, 'rv_park', 'rv park');
  // yield fork(getPlaces, dest, 'museum', 'museum');
  // yield fork(getPlaces, dest, 'night_club', 'night club');
}


function* rootSaga() {
  yield all([
    takeLatest(GET_GEOCODE, getGeocode),
    takeLatest(GET_GEOCODE_SUCCESS, getInfo)
  ]);
}

export default rootSaga;
