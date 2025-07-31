import { all, fork } from "redux-saga/effects";
import { watchMenuSaga } from "./sagas/cartSaga";
import { watchMenuItemSaga } from "./sagas/menuItemSaga";

export default function* rootSaga() {
  yield all([
    fork(watchMenuSaga),
    fork(watchMenuItemSaga),
    // add saga
  ]);
}
