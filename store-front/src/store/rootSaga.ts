import { all, fork } from "redux-saga/effects";
import authSaga from "./sagas/auth/authSaga";

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    // add saga
  ]);
}
