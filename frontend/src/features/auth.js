import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem("user")) || null;

const initialStateValue = {
  user,
};

console.log("redux", initialStateValue);

export const authSlice = createSlice({
  name: "auth",
  initialState: { value: initialStateValue },
  reducers: {
    add: (state, action) => {
      state.value = action.payload;
    },
    clear: (state) => {
      state.value = null;
    },
  },
});

export const { add, clear } = authSlice.actions;

export default authSlice.reducer;
