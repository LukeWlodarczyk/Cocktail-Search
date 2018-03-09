import { GET_GEOCODE } from '../constants/action-types';

export const getGeocode = place => {
  return {
    type: GET_GEOCODE,
    payload: place,
  }
}
