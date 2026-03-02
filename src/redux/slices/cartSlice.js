import {createSlice} from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    dispatchItemToCart: (state, action) => {
      const existingItemIndex = state?.cartItems?.findIndex(
        item => item?._id === action?.payload?._id,
      );
      let modifiedCart;
      if (existingItemIndex !== -1) {
        modifiedCart = state?.cartItems?.map(item =>
          item?._id === action?.payload?._id ? action.payload : item,
        );
      } else {
        modifiedCart = [...state.cartItems, action.payload];
      }
      state.cartItems = modifiedCart;
    },
    dispatchRemoveCartItem: (state, action) => {
      const updatedCart = state?.cartItems?.filter(
        item => item?._id !== action.payload,
      );
      state.cartItems = updatedCart;
    },
    dispatchMakeCartEmpty: state => {
      state.cartItems = [];
    },
  },
});

export const {
  dispatchItemToCart,
  dispatchRemoveCartItem,
  dispatchMakeCartEmpty,
} = cartSlice.actions;

export default cartSlice.reducer;
