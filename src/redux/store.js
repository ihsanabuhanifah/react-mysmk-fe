import { createStore, combineReducers } from 'redux';

const initialState = {
  profile: null,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  data: profileReducer,
});

const store = createStore(rootReducer);

export default store;