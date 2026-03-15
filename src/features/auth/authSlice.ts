import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const TEST_EMAIL = 'demo@soundcloud.local';
const TEST_PASSWORD = 'demo12345';

interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userEmail: null,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequested(state, action: PayloadAction<{ email: string; password: string }>) {
      const { email, password } = action.payload;

      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        state.isAuthenticated = true;
        state.userEmail = email;
        state.error = null;
        return;
      }

      state.error = 'Неверный email или пароль';
      state.isAuthenticated = false;
      state.userEmail = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userEmail = null;
      state.error = null;
    }
  }
});

export const { loginRequested, clearAuthError, logout } = authSlice.actions;
export const TEST_CREDENTIALS = {
  email: TEST_EMAIL,
  password: TEST_PASSWORD
};

export default authSlice.reducer;
