import { configureStore } from "@reduxjs/toolkit";
import currencyConverterReducer from "../features/CurrencyConverter/currencyConverterSlice";

export default configureStore({
  reducer: { currencyConverter: currencyConverterReducer },
});
