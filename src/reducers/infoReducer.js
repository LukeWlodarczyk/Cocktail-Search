import { GET_INFO_SUCCESS, GET_INFO_REQUESTED } from '../constants/action-types';


const initialState = {
  isLoading: false,
  isError: false,
}

export default (state=initialState, action) => {
  console.log('action',action);
  console.log('action.type',action.type);
  console.log('action.payload', action.payload);
  switch (action.type) {
    case GET_INFO_REQUESTED:
      console.log('success');
      return { ...state, isLoading: true};

    case GET_INFO_SUCCESS:
      console.log('success');
      return Object.assign({}, state, {isLoading: false}, action.payload);
    default:
      return state;
  }
};
