class TravelServiceApi {

  static getWeather3(place) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign({}, {
            place: place,
            forecast: "sun"
        }));
      }, 2000);
    });
  }

  static getWeather2(place) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign({}, {
            place: place,
            forecast: "cloud"
        }));
      }, 1000);
    });
  }

  static getWeather(place) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Object.assign({}, {
            place: place,
            forecast: "rain"
        }));
      }, 3000);
    });
  }

}

export default TravelServiceApi;
