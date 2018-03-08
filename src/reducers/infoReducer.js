import { GET_INFO_SUCCESS, GET_INFO_REQUESTED } from '../constants/action-types';


const initialState = {
  weather: {
    stateName: 'weather',
    isLoading: false,
    error: false,
    data: [],
  }
}

export default (state=initialState, action) => {
  switch (action.type) {
    case GET_INFO_REQUESTED:
      console.log('success');
      return { ...state, };

    case GET_INFO_SUCCESS:
      console.log('success');
      return {...state, };
    default:
      return state;
  }
};
