import {
  GET_INFO_SUCCESS,
  GET_INFO_REQUESTED,
  GET_INFO_FAILED
} from '../constants/action-types';


const initialState = {
  weather: {},
  distance: {},
  loading: {
    weather: false,
    distance: false
  },
  error: {
    weather: false,
    distance: false
  }

}

export default (state=initialState, action) => {
  switch (action.type) {
    case GET_INFO_REQUESTED:
      console.log('request');
      return {
              ...state,
              loading: { ...state.loading, ...action.loading}
            };
    case GET_INFO_SUCCESS:
      console.log('success');
      return {
              ...state,
              ...action.payload,
              loading: { ...state.loading, ...action.loading }
            };
    case GET_INFO_FAILED:
      console.log('fail');
      return {
              ...state,
              error: { ...state.error, ...action.error },
              loading: { ...state.loading, ...action.loading }
            };
    default:
      return state;
  }
};
