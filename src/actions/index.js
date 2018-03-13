import { GET_GEOCODE } from '../constants/action-types';

export const getGeocode = locations => {
  return {
    type: GET_GEOCODE,
    payload: locations,
  }
}
