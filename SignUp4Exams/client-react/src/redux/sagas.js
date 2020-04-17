import { call, put, takeEvery, all } from 'redux-saga/effects'
import * as actionCreators from './actions';
import { message } from 'antd';
import store from './store';
import instance from '../components/axiosCore';



function* watchLogin() {
  yield takeEvery('LOGIN_REQUEST', function*(action){
    let payload = action.payload;
    try{
      const res = yield call(instance.get, '/admin/login', {
        params: {
          username: payload.username,
          password: payload.password
        }
      })
      if(res && res.data && res.data.state){
        message.success('登录成功');
        yield put(actionCreators.loginSuccess( Object.assign({}, res.data, {username: payload.username}) ));
      } else {
        if(res && res.data && res.data.message==='wrong password'){
          message.error('密码错误');
        } else {
          message.info('登录失败');
        }
        yield put(actionCreators.loginFailure(res.data))
      }
    } catch(err) {
      console.log(err)
      message.info('请求失败');
      yield put(actionCreators.loginFailure({message: err}))
    }
  })
}

function* watchQueryInfo(){
  yield takeEvery( 'QUERY_INFO_REQUEST', function*(action){
    let token = store.getState().session.token;
    try{
      let res = yield all([
        call(instance.get, '/userinfo', {
          params: { method: 'queryUserInfoAll' },
          headers: { authorization: `Bearer ${token}` }
        }),
        call(instance.get, '/subjects', {
          params: { method: 'querySubjAll' },
          headers: { authorization: `Bearer ${token}` }
        }),
        call(instance.get, '/admin/trades', {
          headers: { authorization: `Bearer ${token}` }
        })
      ]);
      if(res.every(ele => ele.status)){
        let userinfo = res[0].data.userinfo;
        let subjects = res[1].data.subjects;
        let trades = res[2].data.trades
        yield put( actionCreators.queryInfoSuccess({userinfo, subjects, trades}) )
      } else {
        yield put( actionCreators.queryInfoFailure(res) )
      }
    } catch(err) {
      yield put( actionCreators.queryInfoFailure(err) )
    }
  })
}

function* watchAddSubject(){
  yield takeEvery('ADD_SUBJECT_REQUEST', function*(action){
    let payload = action.payload;
    let token = store.getState().session.token;
    try {
      let res = yield call(instance.post, '/subjects',{
        method: 'addSubj',
        subjectName: payload.subjectName,
        subjectCost: payload.subjectCost,
        registerDeadline: payload.registerDeadline,
        examTime: payload.examTime
      }, {
        headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      console.log(res);
      if(res && res.data && res.data.state){
        yield put( actionCreators.addSubjectSuccess(res.data) );
        message.success('添加科目成功');
        yield put( actionCreators.queryInfoRequest('ALL') )
      } else {
        yield put( actionCreators.addSubjectFailure(res.data));
      }
    } catch(err) {
      yield put( actionCreators.addSubjectFailure(err) );
    }
  })
}

function* watchDeleteSubj(){
  yield takeEvery('DELETE_SUBJ_REQUEST', function*(action){
    let subjectName = action.payload;
    let token = store.getState().session.token;
    try {
      let res = yield call(instance.delete, '/subjects', {
        headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        data: {
          method: 'deleteSubj',
          subjectName: subjectName
        }
      })
      if(res && res.data && res.data.state){
        yield put( actionCreators.deleteSubjSuccess(res.data) );
        message.success('删除科目成功');
        yield put( actionCreators.queryInfoRequest('ALL') );
      } else {
        yield put( actionCreators.deleteSubjFailure(res.data) );
      }
    } catch(err) {
      yield put( actionCreators.deleteSubjFailure(err) );
    }
  })
}

function* watchQuerySubjUser(){
  yield takeEvery('QUERY_SUBJ_USER_REQUEST', function*(action){
    let subjectID = action.payload;
    let token = store.getState().session.token;
    console.log(action);
    try {
      let res = yield call(instance.get, `/subjects/${subjectID}/userinfo`, {
        params: { method: 'querySubjUser' },
        headers: { authorization: `Bearer ${token}` }
      })
      console.log(res);
      if( res && res.data && res.data.state ){
        yield put( actionCreators.querySubjUserSuccess(res.data) );
      } else {
        yield put( actionCreators.querySubjUserFailure(res.data) );
      }
    } catch (err) {
      yield put( actionCreators.querySubjUserFailure(err) );
    }
  })
}

function* watchSetScore(){
  yield takeEvery('SET_SCORE_REQUEST', function*(action){
    let token = store.getState().session.token;
    let { subjectID, userID, score } = action.payload;
    try {
      let res = yield call(instance.put, `/subjects/${subjectID}/setScore`, {
        method: 'submitSubjScore',
        scoreInfo: [{
          userID: userID,
          score: score
        }]
      }, {
        headers: { authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
      console.log(res);
      if(res && res.data && res.data.state){
        message.success('提交成功');
        yield put( actionCreators.setScoreSuccess({subjectID, userID, score}) )
        yield put( actionCreators.querySubjUserRequest(subjectID) );
      } else {
        yield put( actionCreators.setScoreFailure(res.data) );
      }
    } catch(err) {
      yield put( actionCreators.setScoreFailure(err) );
    }
  })
}

function* watchLoginVerify() {
  yield takeEvery('LOGIN_VERIFY_REQUEST', function*(action){
    let { token, username } = action.payload;
    try{
      const res = yield call(instance.get, '/admin/verify', {
        headers: { authorization: `Bearer ${token}` }
      })
      if(res && res.data && res.data.state){
        yield put( actionCreators.loginVerifySuccess({token, username}) );
      } else {
        yield put(actionCreators.loginVerifyFailure(res.data))
      }
    } catch(err) {
      console.log(err)
      yield put(actionCreators.loginVerifyFailure({err}))
    }
  })
}

export default function* rootSaga() {
  console.log('saga running')
  yield all([
    watchLogin(),
    watchQueryInfo(),
    watchAddSubject(),
    watchDeleteSubj(),
    watchQuerySubjUser(),
    watchSetScore(),
    watchLoginVerify()
  ])
}