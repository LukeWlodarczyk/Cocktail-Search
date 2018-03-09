import { takeLatest, takeEvery, take, select, call, put, fork, all } from 'redux-saga/effects';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { fetchWeather } from './apiCalls';
import {
  GET_INFO_REQUESTED,
  GET_INFO_SUCCESS,
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

const selectGeocode = state => state.geocode.geocode;

function* getInfo() {
  // yield take('GET_GEOCODE_SUCCESS');
  const geocode = yield select(selectGeocode);
  yield fork(getWeather, geocode);
  // yield fork(fetchWeather2, action.payload);
  // yield fork(fetchWeather3, action.payload);
}


function* getWeather(geocode) {
  // yield put({type: GET_INFO_REQUESTED, payload: { isLoading: true, name: 'weather' } });
  const weather = yield call(fetchWeather, geocode)
  yield put({type: GET_INFO_SUCCESS, payload:{ weather }});
}

function userPositionPromised() {
  const position = {}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition (
      location  => position.on({location}),
      error     => position.on({error}),
      { enableHighAccuracy: true }
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



function* rootSaga() {
  console.log('rootSaga');
  yield all([
    fork(getUserLocation),
    takeLatest(GET_GEOCODE, getGeocode),
    takeLatest(GET_GEOCODE_SUCCESS, getInfo)
  ]);
}

export default rootSaga;


//
// {
//   "cod": "200",
//   "message": 0.005,
//   "cnt": 40,
//   "list": [{
//     "dt": 1520467200,
//     "main": {
//       "temp": 20.62,
//       "temp_min": 19.82,
//       "temp_max": 20.62,
//       "pressure": 1028.75,
//       "sea_level": 1029.2,
//       "grnd_level": 1028.75,
//       "humidity": 42,
//       "temp_kf": 0.8
//     },
//     "weather": [{
//       "id": 803,
//       "main": "Clouds",
//       "description": "broken clouds",
//       "icon": "04n"
//     }],
//     "clouds": {
//       "all": 64
//     },
//     "wind": {
//       "speed": 3.86,
//       "deg": 323.001
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-08 00:00:00"
//   }, {
//     "dt": 1520478000,
//     "main": {
//       "temp": 17.75,
//       "temp_min": 17.15,
//       "temp_max": 17.75,
//       "pressure": 1029.91,
//       "sea_level": 1030.48,
//       "grnd_level": 1029.91,
//       "humidity": 49,
//       "temp_kf": 0.6
//     },
//     "weather": [{
//       "id": 802,
//       "main": "Clouds",
//       "description": "scattered clouds",
//       "icon": "03n"
//     }],
//     "clouds": {
//       "all": 44
//     },
//     "wind": {
//       "speed": 3.15,
//       "deg": 307.001
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-08 03:00:00"
//   }, {
//     "dt": 1520488800,
//     "main": {
//       "temp": 14.75,
//       "temp_min": 14.35,
//       "temp_max": 14.75,
//       "pressure": 1030.48,
//       "sea_level": 1030.99,
//       "grnd_level": 1030.48,
//       "humidity": 56,
//       "temp_kf": 0.4
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 4.77,
//       "deg": 326.503
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-08 06:00:00"
//   }, {
//     "dt": 1520499600,
//     "main": {
//       "temp": 12,
//       "temp_min": 11.81,
//       "temp_max": 12,
//       "pressure": 1030.42,
//       "sea_level": 1030.78,
//       "grnd_level": 1030.42,
//       "humidity": 68,
//       "temp_kf": 0.2
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 3.92,
//       "deg": 329.505
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-08 09:00:00"
//   }, {
//     "dt": 1520510400,
//     "main": {
//       "temp": 9.94,
//       "temp_min": 9.94,
//       "temp_max": 9.94,
//       "pressure": 1031.7,
//       "sea_level": 1032.22,
//       "grnd_level": 1031.7,
//       "humidity": 79,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 3.95,
//       "deg": 338.001
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-08 12:00:00"
//   }, {
//     "dt": 1520521200,
//     "main": {
//       "temp": 16.23,
//       "temp_min": 16.23,
//       "temp_max": 16.23,
//       "pressure": 1033.1,
//       "sea_level": 1033.59,
//       "grnd_level": 1033.1,
//       "humidity": 53,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 6.16,
//       "deg": 338.003
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-08 15:00:00"
//   }, {
//     "dt": 1520532000,
//     "main": {
//       "temp": 18.2,
//       "temp_min": 18.2,
//       "temp_max": 18.2,
//       "pressure": 1032.4,
//       "sea_level": 1032.89,
//       "grnd_level": 1032.4,
//       "humidity": 45,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 802,
//       "main": "Clouds",
//       "description": "scattered clouds",
//       "icon": "03d"
//     }],
//     "clouds": {
//       "all": 32
//     },
//     "wind": {
//       "speed": 7.56,
//       "deg": 316.001
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-08 18:00:00"
//   }, {
//     "dt": 1520542800,
//     "main": {
//       "temp": 19.54,
//       "temp_min": 19.54,
//       "temp_max": 19.54,
//       "pressure": 1030.7,
//       "sea_level": 1031.26,
//       "grnd_level": 1030.7,
//       "humidity": 39,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 7.15,
//       "deg": 309
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-08 21:00:00"
//   }, {
//     "dt": 1520553600,
//     "main": {
//       "temp": 16.37,
//       "temp_min": 16.37,
//       "temp_max": 16.37,
//       "pressure": 1031.33,
//       "sea_level": 1031.74,
//       "grnd_level": 1031.33,
//       "humidity": 44,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 4.36,
//       "deg": 296.502
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-09 00:00:00"
//   }, {
//     "dt": 1520564400,
//     "main": {
//       "temp": 13.07,
//       "temp_min": 13.07,
//       "temp_max": 13.07,
//       "pressure": 1032.68,
//       "sea_level": 1033.19,
//       "grnd_level": 1032.68,
//       "humidity": 51,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 5.47,
//       "deg": 299.501
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-09 03:00:00"
//   }, {
//     "dt": 1520575200,
//     "main": {
//       "temp": 11.11,
//       "temp_min": 11.11,
//       "temp_max": 11.11,
//       "pressure": 1033.05,
//       "sea_level": 1033.5,
//       "grnd_level": 1033.05,
//       "humidity": 55,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10n"
//     }],
//     "clouds": {
//       "all": 20
//     },
//     "wind": {
//       "speed": 4.67,
//       "deg": 324
//     },
//     "rain": {
//       "3h": 0.0049999999999999
//     },
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-09 06:00:00"
//   }, {
//     "dt": 1520586000,
//     "main": {
//       "temp": 7.87,
//       "temp_min": 7.87,
//       "temp_max": 7.87,
//       "pressure": 1033.02,
//       "sea_level": 1033.45,
//       "grnd_level": 1033.02,
//       "humidity": 71,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 3.76,
//       "deg": 341.002
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-09 09:00:00"
//   }, {
//     "dt": 1520596800,
//     "main": {
//       "temp": 6.96,
//       "temp_min": 6.96,
//       "temp_max": 6.96,
//       "pressure": 1034.09,
//       "sea_level": 1034.57,
//       "grnd_level": 1034.09,
//       "humidity": 69,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 20
//     },
//     "wind": {
//       "speed": 4.41,
//       "deg": 349.505
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-09 12:00:00"
//   }, {
//     "dt": 1520607600,
//     "main": {
//       "temp": 15.73,
//       "temp_min": 15.73,
//       "temp_max": 15.73,
//       "pressure": 1035.3,
//       "sea_level": 1035.76,
//       "grnd_level": 1035.3,
//       "humidity": 40,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 802,
//       "main": "Clouds",
//       "description": "scattered clouds",
//       "icon": "03d"
//     }],
//     "clouds": {
//       "all": 36
//     },
//     "wind": {
//       "speed": 5.27,
//       "deg": 347.5
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-09 15:00:00"
//   }, {
//     "dt": 1520618400,
//     "main": {
//       "temp": 19.28,
//       "temp_min": 19.28,
//       "temp_max": 19.28,
//       "pressure": 1034.17,
//       "sea_level": 1034.67,
//       "grnd_level": 1034.17,
//       "humidity": 41,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 3.61,
//       "deg": 3.50543
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-09 18:00:00"
//   }, {
//     "dt": 1520629200,
//     "main": {
//       "temp": 20.5,
//       "temp_min": 20.5,
//       "temp_max": 20.5,
//       "pressure": 1032.88,
//       "sea_level": 1033.38,
//       "grnd_level": 1032.88,
//       "humidity": 38,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 803,
//       "main": "Clouds",
//       "description": "broken clouds",
//       "icon": "04d"
//     }],
//     "clouds": {
//       "all": 76
//     },
//     "wind": {
//       "speed": 2.41,
//       "deg": 27.0004
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-09 21:00:00"
//   }, {
//     "dt": 1520640000,
//     "main": {
//       "temp": 16.98,
//       "temp_min": 16.98,
//       "temp_max": 16.98,
//       "pressure": 1033.02,
//       "sea_level": 1033.55,
//       "grnd_level": 1033.02,
//       "humidity": 45,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 802,
//       "main": "Clouds",
//       "description": "scattered clouds",
//       "icon": "03n"
//     }],
//     "clouds": {
//       "all": 44
//     },
//     "wind": {
//       "speed": 2.06,
//       "deg": 34.0025
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-10 00:00:00"
//   }, {
//     "dt": 1520650800,
//     "main": {
//       "temp": 12.13,
//       "temp_min": 12.13,
//       "temp_max": 12.13,
//       "pressure": 1034.21,
//       "sea_level": 1034.63,
//       "grnd_level": 1034.21,
//       "humidity": 63,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 3.21,
//       "deg": 23.5027
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-10 03:00:00"
//   }, {
//     "dt": 1520661600,
//     "main": {
//       "temp": 10.8,
//       "temp_min": 10.8,
//       "temp_max": 10.8,
//       "pressure": 1033.9,
//       "sea_level": 1034.37,
//       "grnd_level": 1033.9,
//       "humidity": 67,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 3.12,
//       "deg": 11.509
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-10 06:00:00"
//   }, {
//     "dt": 1520672400,
//     "main": {
//       "temp": 9.69,
//       "temp_min": 9.69,
//       "temp_max": 9.69,
//       "pressure": 1032.81,
//       "sea_level": 1033.28,
//       "grnd_level": 1032.81,
//       "humidity": 77,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 2.51,
//       "deg": 8.50034
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-10 09:00:00"
//   }, {
//     "dt": 1520683200,
//     "main": {
//       "temp": 8.94,
//       "temp_min": 8.94,
//       "temp_max": 8.94,
//       "pressure": 1033.23,
//       "sea_level": 1033.73,
//       "grnd_level": 1033.23,
//       "humidity": 81,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 1.32,
//       "deg": 23.5026
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-10 12:00:00"
//   }, {
//     "dt": 1520694000,
//     "main": {
//       "temp": 22.36,
//       "temp_min": 22.36,
//       "temp_max": 22.36,
//       "pressure": 1034.02,
//       "sea_level": 1034.52,
//       "grnd_level": 1034.02,
//       "humidity": 46,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 8
//     },
//     "wind": {
//       "speed": 2.01,
//       "deg": 70.003
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-10 15:00:00"
//   }, {
//     "dt": 1520704800,
//     "main": {
//       "temp": 26.12,
//       "temp_min": 26.12,
//       "temp_max": 26.12,
//       "pressure": 1031.91,
//       "sea_level": 1032.48,
//       "grnd_level": 1031.91,
//       "humidity": 45,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 12
//     },
//     "wind": {
//       "speed": 4.82,
//       "deg": 141.501
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-10 18:00:00"
//   }, {
//     "dt": 1520715600,
//     "main": {
//       "temp": 25.75,
//       "temp_min": 25.75,
//       "temp_max": 25.75,
//       "pressure": 1029.96,
//       "sea_level": 1030.57,
//       "grnd_level": 1029.96,
//       "humidity": 39,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 804,
//       "main": "Clouds",
//       "description": "overcast clouds",
//       "icon": "04d"
//     }],
//     "clouds": {
//       "all": 88
//     },
//     "wind": {
//       "speed": 5.02,
//       "deg": 155.511
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-10 21:00:00"
//   }, {
//     "dt": 1520726400,
//     "main": {
//       "temp": 23.4,
//       "temp_min": 23.4,
//       "temp_max": 23.4,
//       "pressure": 1030.15,
//       "sea_level": 1030.7,
//       "grnd_level": 1030.15,
//       "humidity": 47,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 802,
//       "main": "Clouds",
//       "description": "scattered clouds",
//       "icon": "03n"
//     }],
//     "clouds": {
//       "all": 36
//     },
//     "wind": {
//       "speed": 4.17,
//       "deg": 168.001
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-11 00:00:00"
//   }, {
//     "dt": 1520737200,
//     "main": {
//       "temp": 20.27,
//       "temp_min": 20.27,
//       "temp_max": 20.27,
//       "pressure": 1031.16,
//       "sea_level": 1031.58,
//       "grnd_level": 1031.16,
//       "humidity": 61,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 20
//     },
//     "wind": {
//       "speed": 3.08,
//       "deg": 191.511
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-11 03:00:00"
//   }, {
//     "dt": 1520748000,
//     "main": {
//       "temp": 14.65,
//       "temp_min": 14.65,
//       "temp_max": 14.65,
//       "pressure": 1030.64,
//       "sea_level": 1031.17,
//       "grnd_level": 1030.64,
//       "humidity": 81,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 1.61,
//       "deg": 231.003
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-11 06:00:00"
//   }, {
//     "dt": 1520758800,
//     "main": {
//       "temp": 12.44,
//       "temp_min": 12.44,
//       "temp_max": 12.44,
//       "pressure": 1030.1,
//       "sea_level": 1030.6,
//       "grnd_level": 1030.1,
//       "humidity": 85,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 20
//     },
//     "wind": {
//       "speed": 1.55,
//       "deg": 291.006
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-11 09:00:00"
//   }, {
//     "dt": 1520769600,
//     "main": {
//       "temp": 12.55,
//       "temp_min": 12.55,
//       "temp_max": 12.55,
//       "pressure": 1031.07,
//       "sea_level": 1031.56,
//       "grnd_level": 1031.07,
//       "humidity": 83,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 1.94,
//       "deg": 305.002
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-11 12:00:00"
//   }, {
//     "dt": 1520780400,
//     "main": {
//       "temp": 23.73,
//       "temp_min": 23.73,
//       "temp_max": 23.73,
//       "pressure": 1031.83,
//       "sea_level": 1032.35,
//       "grnd_level": 1031.83,
//       "humidity": 50,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01d"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 2.23,
//       "deg": 312.004
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-11 15:00:00"
//   }, {
//     "dt": 1520791200,
//     "main": {
//       "temp": 27.63,
//       "temp_min": 27.63,
//       "temp_max": 27.63,
//       "pressure": 1029.68,
//       "sea_level": 1030.23,
//       "grnd_level": 1029.68,
//       "humidity": 47,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 8
//     },
//     "wind": {
//       "speed": 1.88,
//       "deg": 302.504
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-11 18:00:00"
//   }, {
//     "dt": 1520802000,
//     "main": {
//       "temp": 28.88,
//       "temp_min": 28.88,
//       "temp_max": 28.88,
//       "pressure": 1027.15,
//       "sea_level": 1027.75,
//       "grnd_level": 1027.15,
//       "humidity": 41,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02d"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 1.23,
//       "deg": 237.501
//     },
//     "rain": {},
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-11 21:00:00"
//   }, {
//     "dt": 1520812800,
//     "main": {
//       "temp": 26.18,
//       "temp_min": 26.18,
//       "temp_max": 26.18,
//       "pressure": 1026.99,
//       "sea_level": 1027.72,
//       "grnd_level": 1026.99,
//       "humidity": 46,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 804,
//       "main": "Clouds",
//       "description": "overcast clouds",
//       "icon": "04n"
//     }],
//     "clouds": {
//       "all": 88
//     },
//     "wind": {
//       "speed": 1.69,
//       "deg": 210.502
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-12 00:00:00"
//   }, {
//     "dt": 1520823600,
//     "main": {
//       "temp": 23.23,
//       "temp_min": 23.23,
//       "temp_max": 23.23,
//       "pressure": 1027.92,
//       "sea_level": 1028.48,
//       "grnd_level": 1027.92,
//       "humidity": 56,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 20
//     },
//     "wind": {
//       "speed": 3.77,
//       "deg": 246.002
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-12 03:00:00"
//   }, {
//     "dt": 1520834400,
//     "main": {
//       "temp": 18.79,
//       "temp_min": 18.79,
//       "temp_max": 18.79,
//       "pressure": 1027.37,
//       "sea_level": 1027.76,
//       "grnd_level": 1027.37,
//       "humidity": 76,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 800,
//       "main": "Clear",
//       "description": "clear sky",
//       "icon": "01n"
//     }],
//     "clouds": {
//       "all": 0
//     },
//     "wind": {
//       "speed": 2.42,
//       "deg": 221.004
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-12 06:00:00"
//   }, {
//     "dt": 1520845200,
//     "main": {
//       "temp": 16.37,
//       "temp_min": 16.37,
//       "temp_max": 16.37,
//       "pressure": 1025.47,
//       "sea_level": 1025.95,
//       "grnd_level": 1025.47,
//       "humidity": 87,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 801,
//       "main": "Clouds",
//       "description": "few clouds",
//       "icon": "02n"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 1.57,
//       "deg": 206.004
//     },
//     "rain": {},
//     "sys": {
//       "pod": "n"
//     },
//     "dt_txt": "2018-03-12 09:00:00"
//   }, {
//     "dt": 1520856000,
//     "main": {
//       "temp": 18.8,
//       "temp_min": 18.8,
//       "temp_max": 18.8,
//       "pressure": 1024.35,
//       "sea_level": 1024.86,
//       "grnd_level": 1024.35,
//       "humidity": 86,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 48
//     },
//     "wind": {
//       "speed": 3.56,
//       "deg": 181.502
//     },
//     "rain": {
//       "3h": 0.0025000000000004
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-12 12:00:00"
//   }, {
//     "dt": 1520866800,
//     "main": {
//       "temp": 27.12,
//       "temp_min": 27.12,
//       "temp_max": 27.12,
//       "pressure": 1023.55,
//       "sea_level": 1023.95,
//       "grnd_level": 1023.55,
//       "humidity": 62,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 24
//     },
//     "wind": {
//       "speed": 8.61,
//       "deg": 203.504
//     },
//     "rain": {
//       "3h": 0.0125
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-12 15:00:00"
//   }, {
//     "dt": 1520877600,
//     "main": {
//       "temp": 25.69,
//       "temp_min": 25.69,
//       "temp_max": 25.69,
//       "pressure": 1022.07,
//       "sea_level": 1022.68,
//       "grnd_level": 1022.07,
//       "humidity": 61,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 500,
//       "main": "Rain",
//       "description": "light rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 92
//     },
//     "wind": {
//       "speed": 12.01,
//       "deg": 247.005
//     },
//     "rain": {
//       "3h": 0.65
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-12 18:00:00"
//   }, {
//     "dt": 1520888400,
//     "main": {
//       "temp": 23.74,
//       "temp_min": 23.74,
//       "temp_max": 23.74,
//       "pressure": 1021.12,
//       "sea_level": 1021.63,
//       "grnd_level": 1021.12,
//       "humidity": 70,
//       "temp_kf": 0
//     },
//     "weather": [{
//       "id": 501,
//       "main": "Rain",
//       "description": "moderate rain",
//       "icon": "10d"
//     }],
//     "clouds": {
//       "all": 20
//     },
//     "wind": {
//       "speed": 9.16,
//       "deg": 250.002
//     },
//     "rain": {
//       "3h": 5.225
//     },
//     "sys": {
//       "pod": "d"
//     },
//     "dt_txt": "2018-03-12 21:00:00"
//   }],
//   "city": {
//     "id": 4155966,
//     "name": "Fort Lauderdale",
//     "coord": {
//       "lat": 26.1223,
//       "lon": -80.1434
//     },
//     "country": "US",
//     "population": 165521
//   }
// }
