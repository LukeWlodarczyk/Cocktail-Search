import { GET_LOCATION_REQUESTED,
          GET_LOCATION_SUCCESS,
          GET_LOCATION_FAILED
        } from '../constants/action-types';


const initialState = {
  location: {},
  isLoading: false,
  error: '',
}

export default (state=initialState, action) => {
  switch (action.type) {
    case GET_LOCATION_REQUESTED:
      return { ...state, isLoading: true};
    case GET_LOCATION_SUCCESS:
      return {...state, isLoading: false, location: action.payload};
    case GET_LOCATION_FAILED:
      return {...state, isLoading: false, error: action.payload};
    default:
      return state;
  }
};
