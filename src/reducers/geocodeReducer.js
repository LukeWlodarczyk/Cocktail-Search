import {
  GET_GEOCODE_REQUESTED,
  GET_GEOCODE_SUCCESS,
  GET_GEOCODE_FAILED
} from '../constants/action-types';


const initialState = {
  userLocation: {},
  destination: {},
  isLoading: false,
  error: '',
}

export default (state=initialState, action) => {
  switch (action.type) {
    case GET_GEOCODE_REQUESTED:
      return { ...state, isLoading: true};
    case GET_GEOCODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userLocation: action.payload.userLoc,
        destination: action.payload.dest
      };
    case GET_GEOCODE_FAILED:
      return {...state, isLoading: false, error: action.payload};
    default:
      return state;
  }
};
