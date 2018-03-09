import {
  GET_GEOCODE_REQUESTED,
  GET_GEOCODE_SUCCESS,
  GET_GEOCODE_FAILED
} from '../constants/action-types';


const initialState = {
  geocode: {},
  isLoading: false,
  error: '',
}

export default (state=initialState, action) => {
  switch (action.type) {
    case GET_GEOCODE_REQUESTED:
      return { ...state, isLoading: true};
    case GET_GEOCODE_SUCCESS:
      return {...state, isLoading: false, geocode: action.payload};
    case GET_GEOCODE_FAILED:
      return {...state, isLoading: false, error: action.payload};
    default:
      return state;
  }
};
