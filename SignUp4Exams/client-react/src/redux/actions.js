// 登录请求相关
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export function loginRequest(payload){
  return { type: "LOGIN_REQUEST", payload }
}
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export function loginSuccess(payload){
  return { type: "LOGIN_SUCCESS", payload: payload }
}
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export function loginFailure(payload){
  return { type: 'LOGIN_FAILURE', payload: payload }
}

export const LOGIN_VERIFY_REQUEST = "LOGIN_VERIFY_REQUEST";
export function loginVerifyRequest(payload){
  return { type: LOGIN_VERIFY_REQUEST, payload }
}
export const LOGIN_VERIFY_SUCCESS = "LOGIN_VERIFY_SUCCESS";
export function loginVerifySuccess(payload){
  return { type: LOGIN_VERIFY_SUCCESS, payload }
}
export const LOGIN_VERIFY_FAILURE = "LOGIN_VERIFY_FAILURE";
export function loginVerifyFailure(payload){
  return { type: LOGIN_VERIFY_FAILURE, payload }
}


export const LOGOUT = "LOGOUT";
export function logout(){
  return { type: "LOGOUT" }
}


// 请求data数据
export const QUERY_INFO_REQUEST = "QUERY_INFO_REQUEST";
export function queryInfoRequest(payload='ALL'){
  return {type: 'QUERY_INFO_REQUEST', payload}
}
export const QUERY_INFO_SUCCESS = "QUERY_INFO_SUCCESS";
export function queryInfoSuccess(payload){
  return {type: 'QUERY_INFO_SUCCESS', payload}
}
export const QUERY_INFO_FAILURE = "QUERY_INFO_FAILURE";
export function queryInfoFailure(payload){
  return {type: 'QUERY_INFO_FAILURE', payload}
}


// 更改数据的请求
export const ADD_SUBJECT_REQUEST = "ADD_SUBJECT_REQUEST";
export function addSubjectRequest(payload){
  return {type: 'ADD_SUBJECT_REQUEST', payload}
}
export const ADD_SUBJECT_SUCCESS = "ADD_SUBJECT_SUCCESS";
export function addSubjectSuccess(payload){
  return {type: 'ADD_SUBJECT_SUCCESS', payload}
}
export const ADD_SUBJECT_FAILURE = "ADD_SUBJECT_FAILURE";
export function addSubjectFailure(payload){
  return {type: 'ADD_SUBJECT_FAILURE', payload}
}


export const DELETE_SUBJ_REQUEST = "DELETE_SUBJ_REQUEST";
export function deleteSubjRequest(payload){
  return {type: 'DELETE_SUBJ_REQUEST', payload}
}
export const DELETE_SUBJ_SUCCESS = "DELETE_SUBJ_SUCCESS";
export function deleteSubjSuccess(payload){
  return {type: 'DELETE_SUBJ_SUCCESS', payload}
}
export const DELETE_SUBJ_FAILURE = "DELETE_SUBJ_FAILURE";
export function deleteSubjFailure(payload){
  return {type: 'DELETE_SUBJ_FAILURE', payload}
}


export const QUERY_SUBJ_USER_REQUEST = "QUERY_SUBJ_USER_REQUEST";
export function querySubjUserRequest(payload){
  return {type: 'QUERY_SUBJ_USER_REQUEST', payload}
}
export const QUERY_SUBJ_USER_SUCCESS = "QUERY_SUBJ_USER_SUCCESS";
export function querySubjUserSuccess(payload){
  return {type: 'QUERY_SUBJ_USER_SUCCESS', payload}
}
export const QUERY_SUBJ_USER_FAILURE = "QUERY_SUBJ_USER_FAILURE";
export function querySubjUserFailure(payload){
  return {type: 'QUERY_SUBJ_USER_FAILURE', payload}
}


export const SET_SCORE_REQUEST = "SET_SCORE_REQUEST";
export function setScoreRequest(payload){
  return {type: 'SET_SCORE_REQUEST', payload}
}
export const SET_SCORE_SUCCESS = "SET_SCORE_SUCCESS";
export function setScoreSuccess(payload){
  return {type: 'SET_SCORE_SUCCESS', payload}
}
export const SET_SCORE_FAILURE = "SET_SCORE_FAILURE";
export function setScoreFailure(payload){
  return {type: 'SET_SCORE_FAILURE', payload}
}