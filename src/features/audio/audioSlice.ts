import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AudioItem } from '@/types/audio';

interface AudioState {
  items: AudioItem[];
}

const initialState: AudioState = {
  items: []
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    addAudio(state, action: PayloadAction<AudioItem>) {
      state.items.unshift(action.payload);
    }
  }
});

export const { addAudio } = audioSlice.actions;
export default audioSlice.reducer;
