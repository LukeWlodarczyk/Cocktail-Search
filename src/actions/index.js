import { GET_INFO_REQUESTED } from '../constants/action-types';

export const getInfo = place => {
  console.log(place);
  return {
    type: GET_INFO_REQUESTED,
    payload: place,
  }
}
