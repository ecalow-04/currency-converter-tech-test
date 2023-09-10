import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Helper functions for converting primary and secondary amounts
const convertSecondaryAmount = (state) => {
  state.validationErrors["primaryAmount"] = null;
  state.primaryAmount = (
    state.secondaryAmount *
    state.conversionRates[state.secondaryCurrency].inverseRate
  ).toFixed(2);
};

const convertPrimaryAmount = (state) => {
  state.validationErrors["secondaryAmount"] = null;
  if (
    state.primaryAmount == "" ||
    state.secondaryCurrency === state.primaryCurrency
  ) {
    state.secondaryAmount = state.primaryAmount;
  } else {
    state.secondaryAmount = (
      state.primaryAmount * state.conversionRates[state.secondaryCurrency].rate
    ).toFixed(2);
  }
};

const initialState = {
  primaryCurrency: "gbp",
  primaryAmount: "",
  secondaryCurrency: "usd",
  secondaryAmount: "",
  conversionRates: {},
  ratesLoadingState: "",
  validationErrors: {},
};

export const getConversionRatesByCode = createAsyncThunk(
  "currencyConverter/getConversionRatesByCode",
  async (currencyCode) => {
    const res = await fetch(
      `https://www.floatrates.com/daily/${currencyCode}.json`,
    );
    return res.json();
  },
);

export const currencyConverterSlice = createSlice({
  name: "CurrencyConverter",
  initialState,
  reducers: {
    setPrimaryAmount: (state, action) => {
      const { error, value } = action.payload;
      state.primaryAmount = value;
      state.validationErrors["primaryAmount"] = error || null;
      if (error) return;
      convertPrimaryAmount(state);
    },
    setPrimaryCurrency: (state, action) => {
      state.primaryCurrency = action.payload.value;
      convertPrimaryAmount(state);
    },
    setSecondaryAmount: (state, action) => {
      const { error, value } = action.payload;
      state.secondaryAmount = value;
      state.validationErrors["secondaryAmount"] = error || null;
      if (error) return;
      convertSecondaryAmount(state);
    },
    setSecondaryCurrency: (state, action) => {
      state.secondaryCurrency = action.payload.value;
      convertPrimaryAmount(state);
    },
  },
  extraReducers: {
    [getConversionRatesByCode.pending]: (state) => {
      state.secondaryAmount = "";
    },
    [getConversionRatesByCode.fulfilled]: (state, action) => {
      state.conversionRates = action.payload;
    },
  },
});

export const {
  setPrimaryCurrency,
  setPrimaryAmount,
  setSecondaryCurrency,
  setSecondaryAmount,
} = currencyConverterSlice.actions;

export default currencyConverterSlice.reducer;
