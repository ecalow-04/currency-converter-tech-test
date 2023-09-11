import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Helper functions for converting primary and secondary amounts that also set the opposite field with the result,
// separated them into 2 different functions as there is 1 case where we would want to convert the secondary amount
// and set the primary amount with the result, but 3 cases vice versa. Also makes it more readable.
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

const convertSecondaryAmount = (state) => {
  state.validationErrors["primaryAmount"] = null;
  state.primaryAmount = (
    state.secondaryAmount *
    state.conversionRates[state.secondaryCurrency].inverseRate
  ).toFixed(2);
};

const initialState = {
  primaryCurrency: "gbp",
  primaryAmount: 1,
  secondaryCurrency: "usd",
  secondaryAmount: 0,
  conversionRates: {},
  validationErrors: {},
  ratesLoading: false,
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
    // Separated into 4 actions so that it is more readable and self-explanatory as to what is happening
    setPrimaryAmount: (state, action) => {
      const { error, value } = action.payload;
      state.primaryAmount = value;
      state.validationErrors["primaryAmount"] = error || null;
      if (!error) convertPrimaryAmount(state);
    },
    setPrimaryCurrency: (state, action) => {
      state.primaryCurrency = action.payload.value;
      if (!state.validationErrors["primaryAmount"]) convertPrimaryAmount(state);
    },
    setSecondaryAmount: (state, action) => {
      const { error, value } = action.payload;
      state.secondaryAmount = value;
      state.validationErrors["secondaryAmount"] = error || null;
      if (!error) convertSecondaryAmount(state);
    },
    setSecondaryCurrency: (state, action) => {
      state.secondaryCurrency = action.payload.value;
      if (!state.validationErrors["primaryAmount"]) convertPrimaryAmount(state);
    },
  },
  extraReducers: (builder) => {
    // Handle async action states
    builder
      .addCase(getConversionRatesByCode.pending, (state) => {
        state.secondaryAmount = 0;
        state.ratesLoading = true;
      })
      .addCase(getConversionRatesByCode.fulfilled, (state, action) => {
        state.conversionRates = action.payload;
        state.ratesLoading = false;
      });
  },
});

export const {
  setPrimaryCurrency,
  setPrimaryAmount,
  setSecondaryCurrency,
  setSecondaryAmount,
} = currencyConverterSlice.actions;

export default currencyConverterSlice.reducer;
