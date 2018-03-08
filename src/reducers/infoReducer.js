import { GET_INFO_SUCCESS, GET_INFO_REQUESTED } from '../constants/action-types';


const initialState = {
  geocode: '',
  weather: {
    isLoading: false,
    isError: false,
    data: [],
  }
}

export default (state=initialState, action) => {
  console.log('action',action);
  console.log(state);
  switch (action.type) {
    case GET_INFO_REQUESTED:
      console.log('success');
      return { ...state, isLoading: true};

    case GET_INFO_SUCCESS:
      console.log('success');
      return {...state, isLoading: false, ...action.payload};
    default:
      return state;
  }
};
