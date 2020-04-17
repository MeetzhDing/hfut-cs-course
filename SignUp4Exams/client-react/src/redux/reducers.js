import { combineReducers } from 'redux'

import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_VERIFY_SUCCESS,
  LOGIN_VERIFY_FAILURE,
  LOGOUT,
  QUERY_INFO_SUCCESS,
  DELETE_SUBJ_SUCCESS,
  ADD_SUBJECT_SUCCESS,
  QUERY_SUBJ_USER_SUCCESS,
  QUERY_SUBJ_USER_FAILURE,
  QUERY_SUBJ_USER_REQUEST,
} from './actions';
import { message } from 'antd';

const initialState  = {
  session: {
    username: '',
    token: ''
  },
  data: {
    userinfo: {},
    subjects: {},
    trades: {},
  },
  ui: {
    regScore: {
      subjectName: '',
      subjUserInfo: []
    }
  }
}

function sessionReducer(state = initialState.session, action){
  let payload = action.payload;
  switch (action.type){
    case LOGIN_SUCCESS:
      let { username, token } = payload;
      window.localStorage.setItem('adminUsername', username);
      window.localStorage.setItem('adminToken', token);
      return { ...state, username, token};
    case LOGIN_FAILURE:
      return state;
    case LOGIN_VERIFY_SUCCESS:
      return { ...state, ...payload};
    case LOGIN_VERIFY_FAILURE:
      message.info('请重新登录');
      window.localStorage.clear();
      return initialState.session;
    case LOGOUT:
      message.success('注销成功');
      window.localStorage.clear();
      return initialState.session;
    default:
      return state;
  }
};

function dataReducer(state = initialState.data, action){
  switch (action.type){
    case QUERY_INFO_SUCCESS:
      return { ...state, ...action.payload };
    case ADD_SUBJECT_SUCCESS:
      return { ...state, subjects: []}
    case DELETE_SUBJ_SUCCESS:
      return { ...state, subjects: []}
    default:
      return state;
  }
}

function regScoreReducer(state = initialState.ui.regScore, action){
  switch (action.type){
    case QUERY_SUBJ_USER_REQUEST:
      return { ...initialState.ui.regScore, subjectName: action.payload}
    case QUERY_SUBJ_USER_SUCCESS:
      return { ...state,  subjUserInfo: action.payload.userinfo }
    case QUERY_SUBJ_USER_FAILURE:
      return initialState.ui.regScore;
    default:
      return initialState.ui.regScore;
  }
}

const uiReducer = combineReducers({
  regScore: regScoreReducer
})

const rootReducer = combineReducers({
  session: sessionReducer,
  data: dataReducer,
  ui: uiReducer
})


export default rootReducer;