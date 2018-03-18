import axios from 'axios';

export const fetchWeather = (geocode) => {
  const key = '36ebef955f1b49690a2bdb5e20d565b8';
  const opt = 'mode=json&units=metric';
  const lat = geocode.lat;
  const lon = geocode.lng;
  const url = `https://api.openweathermap.org/data/2.5/forecast?${opt}&lat=${lat}&lon=${lon}&appid=${key}`;
  return axios.get(url).then( res => {

    // const weather = res.data.list.filter()
    //
    // const weatherData = {
    //   city: res.data.city.name,
    //
    // }

    return res.data
  } );
}

export const fetchDistance = (dest, userLocation) => {
  const key = 'AIzaSyDce84ZG6_2t-0_OMSO-XLA5WlXVqllOag';
  const opt = 'json?units=metric';
  const origins = `${dest.lat},${dest.lng}`;
  const destinations = `${userLocation.lat},${userLocation.lng}`
  const url =  `https://crossorigin.me/https://maps.googleapis.com/maps/api/distancematrix/${opt}&origins=${origins}&destinations=${destinations}&language=en&key=${key}`
  return axios.get(url).then( res => {
    if(res.data.rows[0].elements[0].status === "ZERO_RESULTS") {
      throw new Error("Sorry, we couldn't find connection beetwen these locations")
    }
    const distanceData = {
      distance: res.data.rows[0].elements[0].distance.text,
      duration: res.data.rows[0].elements[0].duration.text
    };
    return distanceData;
  } );
}

export const fetchPlaces = (geocode, placeType, query, radius=5000) => {
  const key = 'AIzaSyAsWq3vCWWaxGMxrEuOKGp8E4JwwxWDnYo';
  const lat = geocode.lat;
  const lon = geocode.lng;
  const queryMod = query.split(', ').map( q => q.split(' ').join('+')).join('+');
  const cors = 'https://cors-anywhere.herokuapp.com/';
  const url =  `${cors}https://maps.googleapis.com/maps/api/place/textsearch/json?query=${queryMod}&type=${placeType}&location=${lat},${lon}&radius=${radius}&limit=5&key=${key}`
  return axios.get(url).then( res => {
    if(res.data.status === "OVER_QUERY_LIMIT") {
      throw new Error('You have exceeded your daily request quota for this API.');
    }
    const placesData = res.data.results.filter( p => !!p.photos).slice(0, 6).map( p => (
      {
        name: p.name,
        address: p.formatted_address,
        photoReference: p.photos[0].photo_reference,
        rating: p.rating
      }
    ));
    return placesData;
  })
}
