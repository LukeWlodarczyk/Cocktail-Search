import TravelServiceApi from '../api/travelServiceApi';

export const getWeather = (place) => {
  return TravelServiceApi.getWeather(place).then(res => {
    console.log('res',res);
    return res
  });
};

export const getWeather2 = (place) => {
  return TravelServiceApi.getWeather2(place).then(res => {
    console.log('res',res);
    return res
  });
};

export const getWeather3 = (place) => {
  return TravelServiceApi.getWeather3(place).then(res => {
    console.log('res',res);
    return res
  });
};
