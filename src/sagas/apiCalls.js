import axios from 'axios';

export const fetchWeather = (geocode) => {
  const key = '36ebef955f1b49690a2bdb5e20d565b8';
  const opt = 'mode=json&units=metric';
  const lat = geocode.lat;
  const lon = geocode.lng;
  const url = `https://api.openweathermap.org/data/2.5/forecast?${opt}&lat=${lat}&lon=${lon}&appid=${key}`;
  return axios.get(url).then( res => res.data );
}

export const fetchDistance = (geocode, userLocation) => {
  const key = 'AIzaSyDce84ZG6_2t-0_OMSO-XLA5WlXVqllOag';
  const opt = 'json?units=metric';
  const origins = `${geocode.lat},${geocode.lng}`;
  const destinations = `${userLocation.lat},${userLocation.lng}`
  const url =  `https://crossorigin.me/https://maps.googleapis.com/maps/api/distancematrix/${opt}&origins=${origins}&destinations=${destinations}&key=${key}`
  console.log('url', url);
  return axios.get(url).then( res => res.data );
}

// export const fetchPlaces = (geocode, type, radius=15000) => {
//   const key = 'AIzaSyDce84ZG6_2t-0_OMSO-XLA5WlXVqllOag';
//   const lat = geocode.lat;
//   const lon = geocode.lng;
//   const url =  `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?language=en&location=${lat},${lon}&radius=${radius}&type=${type}&key=${key}`
//   return axios.get(url).then( res => res.data.results)
// }


export const fetchPlaces = (geocode, placeType, query, radius=15000) => {
  const key = 'AIzaSyDce84ZG6_2t-0_OMSO-XLA5WlXVqllOag';
  const lat = geocode.lat;
  const lon = geocode.lng;
  const queryMod = query.split(', ').map( q => q.split(' ').join('+')).join('+')
  console.log(queryMod);
  const cors = 'https://cors-anywhere.herokuapp.com/';
  const url =  `${cors}https://maps.googleapis.com/maps/api/place/textsearch/json?query=${queryMod}&location=${lat},${lon}&radius=${radius}&key=${key}`
  return axios.get(url).then( res => res.data.results)
}
