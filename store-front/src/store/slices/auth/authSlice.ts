import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface LoginPayload {
  email: string;
  password: string;
}
interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (payload: LoginPayload) => ({ payload }),
    },
    loginSuccess(state, action: PayloadAction<{ accessToken: string }>) {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      localStorage.setItem("accessToken", accessToken);
    },
    loginFailure(state, action: PayloadAction<{ error: string }>) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = action.payload.error;
      state.loading = false;
      localStorage.removeItem("accessToken");
    },
    logout(state) {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("accessToken");
    },
    setTokens(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, setTokens } =
  authSlice.actions;

export default authSlice.reducer;
