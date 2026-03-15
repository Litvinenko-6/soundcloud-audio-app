import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/authSlice';
import audioReducer from '@/features/audio/audioSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    audio: audioReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
