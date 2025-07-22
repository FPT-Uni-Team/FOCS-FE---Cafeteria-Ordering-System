import { call, put, takeLatest } from "redux-saga/effects";
import { login } from "../../../services/authService";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
} from "../../slices/auth/authSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthResponse {
  access_token: string | null;
  errors: string[] | null;
  is_succes: boolean;
}

function* handleLogin(
  action: PayloadAction<{ email: string; password: string }>
): Generator<unknown, void, { data: AuthResponse }> {
  try {
    const response = yield call(login, action.payload);
    if (response?.data?.is_succes) {
      const accessToken = response.data.access_token;
      if (accessToken) {
        yield put(loginSuccess({ accessToken }));
      }
    } else {
      yield put(
        loginFailure({
          error: response.data.errors?.[0] || "Login failed: Unknown error",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Login failed: Unexpected error";
    yield put(
      loginFailure({
        error: errorMessage,
      })
    );
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
}
