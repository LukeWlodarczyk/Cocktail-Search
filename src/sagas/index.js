import { takeLatest, takeEvery, take, select, call, put, fork, all } from 'redux-saga/effects';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { fetchWeather, fetchDistance, fetchUserPosition, fetchPlaces } from './apiCalls';
import {
  GET_INFO_REQUESTED,
  GET_INFO_SUCCESS,
  GET_INFO_FAILED,
  GET_GEOCODE,
  GET_GEOCODE_REQUESTED,
  GET_GEOCODE_SUCCESS,
  GET_GEOCODE_FAILED,
  GET_LOCATION_REQUESTED,
  GET_LOCATION_SUCCESS,
  GET_LOCATION_FAILED
} from '../constants/action-types';

function* getGeocode(action) {
  try {
    yield put({ type: GET_GEOCODE_REQUESTED });
    const results = yield call(geocodeByAddress, action.payload);
    const { lat, lng } = yield call(getLatLng, results[0]);
    const geocode = { lat, lng, name: action.payload };
    yield put({type: GET_GEOCODE_SUCCESS, payload: geocode });
  } catch(error) {
    yield put({type: GET_GEOCODE_FAILED, payload: error })
  }
}


function* getWeather(geocode) {
  try {
    yield put({type: GET_INFO_REQUESTED, loading: { weather: true} });
    const weather = yield call(fetchWeather, geocode)
    yield put({type: GET_INFO_SUCCESS, payload:{ weather }, loading: { weather: false }});
  } catch (error) {
    yield put({type: GET_INFO_FAILED, error:{ weather: error }, loading: { weather: false } });
  }
}


function* getDistance(geocode) {
  try {
    yield put({type: GET_INFO_REQUESTED, loading: { distance: true } });
    const location = yield select( state => state.userLocation.location);
    console.log('location', location);
    const distance = yield call(fetchDistance, geocode, location)
    yield put({type: GET_INFO_SUCCESS, payload:{ distance }, loading: { distance: false }});
  } catch (error) {
    yield put({type: GET_INFO_FAILED, error:{ distance: error }, loading: { distance: false }});
  }
}

function* getPlaces(geocode, placeType, query) {
  try {
    yield put({type: GET_INFO_REQUESTED, loading: { [placeType]: true } });
    const data = yield call(fetchPlaces, geocode, placeType, query)
    yield put({type: GET_INFO_SUCCESS, payload:{ [placeType]: data }, loading: { [placeType]: false }});
  } catch (error) {
    yield put({type: GET_INFO_FAILED, error:{ [placeType]: error }, loading: { [placeType]: false }});
  }
}

function userPositionPromised() {
  const position = {}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition (
      location  => position.on({location}),
      error     => position.on({error}),
      { maximumAge: 50000, timeout: 20000, enableHighAccuracy: false }
    )
  }
  return { getLocation: () => new Promise(location => position.on = location) }
}

function* getUserLocation() {
  yield put({type: GET_LOCATION_REQUESTED});
  const { getLocation } = yield call(userPositionPromised)
  const { error, location } = yield call(getLocation)
  if (error) {
    console.log('Failed to get user position!', error)
    const { message, code } = error;
    yield put({type: GET_LOCATION_FAILED, payload: { code, message }});
  } else {
    console.log('Received User Location', location)
    const { latitude: lat, longitude: lng } = location.coords;
    yield put({type: GET_LOCATION_SUCCESS, payload: { lat, lng } });
  }
}


function* getInfo() {
  const geocode = yield select(state => state.geocode.geocode);
  yield fork(getWeather, geocode);
  yield fork(getDistance, geocode);
  yield fork(getPlaces, geocode, 'cafe', 'cafe');
  yield fork(getPlaces, geocode, 'restaurant', 'restaurant');
  yield fork(getPlaces, geocode, 'bar', 'bar');
  yield fork(getPlaces, geocode, 'lodging', 'lodging, hotel');
  yield fork(getPlaces, geocode, 'shopping_mall', 'shopping mall');
  yield fork(getPlaces, geocode, 'rv_park', 'rv park');
  yield fork(getPlaces, geocode, 'museum', 'museum');
  yield fork(getPlaces, geocode, 'night_club', 'night club');
}


function* rootSaga() {
  console.log('rootSaga');
  yield all([
    fork(getUserLocation),
    takeLatest(GET_GEOCODE, getGeocode),
    takeLatest(GET_GEOCODE_SUCCESS, getInfo)
  ]);
}

export default rootSaga;
