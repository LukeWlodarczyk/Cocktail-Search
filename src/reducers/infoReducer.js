import {
  GET_INFO_SUCCESS,
  GET_INFO_REQUESTED,
  GET_INFO_FAILED
} from '../constants/action-types';


const initialState = {
  weather: {},

}

export default (state=initialState, action) => {
  console.log(state);
  switch (action.type) {
    case GET_INFO_REQUESTED:
      console.log('request');
      return { ...state, };

    case GET_INFO_SUCCESS:
      console.log('success');
      return {...state, ...action.payload  };
    case GET_INFO_FAILED:
      console.log('fail');
      return {...state, };
    default:
      return state;
  }
};
