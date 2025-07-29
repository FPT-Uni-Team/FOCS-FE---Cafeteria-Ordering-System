import { all, fork } from "redux-saga/effects";
import { watchMenuSaga } from "./sagas/cartSaga";

export default function* rootSaga() {
  yield all([
    fork(watchMenuSaga),
    // add saga
  ]);
}
