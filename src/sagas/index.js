import { takeLatest, call, put, fork } from 'redux-saga/effects';
import { GET_INFO_REQUESTED, GET_INFO_SUCCESS } from '../constants/action-types';
import { getWeather, getWeather2, getWeather3 } from './apiCalls';
import axios from 'axios';

function* fetchAll(action) {
  console.log('fetchAll');
  console.log(action);
  yield fork(fetchWeather, action.payload);
  yield fork(fetchWeather2, action.payload);
  yield fork(fetchWeather3, action.payload);
}

function* fetchWeather(place) {
  console.log('weather');
  console.log('place', place);
  const weather = yield call(getWeather, place)
  yield put({type: GET_INFO_SUCCESS, payload: { weather }})
}

function* fetchWeather2(place) {
  console.log('weather2');
  const weather2 = yield call(getWeather2, place)
  yield put({type: GET_INFO_SUCCESS, payload: { weather2 }})
}

function* fetchWeather3(place) {
  console.log('weather3');
  const weather3 = yield call(getWeather3, place)
  console.log('///////////', weather3);
  yield put({type: GET_INFO_SUCCESS, payload: { weather3 }})
}

function* rootSaga() {
  console.log('rootSaga');
  yield takeLatest(GET_INFO_REQUESTED, fetchAll);
}

export default rootSaga;
