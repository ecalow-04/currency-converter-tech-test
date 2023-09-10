import { beforeEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import CurrencyConverter from "./CurrencyConverter";
import currencyConverterReducer, {
  setPrimaryAmount,
  setPrimaryCurrency,
  setSecondaryAmount,
  setSecondaryCurrency,
  getConversionRatesByCode,
} from "./currencyConverterSlice";

describe("Testing Currency Converter Feature", () => {
  const mockInitialState = {
    primaryCurrency: "gbp",
    primaryAmount: 0,
    secondaryCurrency: "usd",
    secondaryAmount: 0,
    conversionRates: {
      usd: { name: "U.S. Dollar", rate: 1.249, inverseRate: 0.801 },
      eur: { name: "Euro", rate: 1.166, inverseRate: 0.859 },
      cad: { name: "Canadian Dollar", rate: 1.705, inverseRate: 0.587 },
    },
    ratesLoadingState: "",
    validationErrors: {},
  };

  // FYI: i have never written tests in React before, but i have a little bit of experience in ember.js and elixir
  //
  // i'm using expect().toHaveProperty() instead of expect().toEqual() because
  // i believe there is either a bug with the vitest plugin, there's some configuration i haven't set that i should have, or i'm simply writing these tests wrong.
  // i went down a very big rabbit hole of trying to fix my issue, and saw that people were experiencing similar issues with Jest
  // but apparently that is now fixed, however i also read Jest isn't fully supported with Vite, hence the creation of Vitest
  // so i decided to carry on and try to find a workaround for now.
  //
  // below is an example of a test i'd expect to work and the error it raises:
  //
  // test("setting primary amount with a valid value changes secondary amount", () => {
  //   const action = setPrimaryAmount({ error: undefined, value: 5 });
  //   const rate =
  //     mockInitialState.conversionRates[mockInitialState.secondaryCurrency].rate;
  //
  //   const expectedState = {
  //     ...mockInitialState,
  //     primaryAmount: 5,
  //     secondaryAmount: (5 * rate).toFixed(2),
  //   };
  //
  //   expect(currencyConverterReducer(mockInitialState, action)).toEqual(
  //     expectedState,
  //   );
  // });
  //
  // Raises TypeError: Cannot assign to read only property 'usd' of object '#<Object>'
  //
  // i can imagine it's to do with the fact that when trying to make a deep copy of the expectedState,
  // it's not making a deep copy of the nested objects and that could be causing an issue somewhere in the plugin

  test("setting primary amount with a valid value changes secondary amount", () => {
    const action = setPrimaryAmount({ value: 5 });
    const rate =
      mockInitialState.conversionRates[mockInitialState.secondaryCurrency].rate;

    expect(currencyConverterReducer(mockInitialState, action))
      .toHaveProperty("primaryAmount", 5)
      .toHaveProperty("secondaryAmount", (5 * rate).toFixed(2));
  });

  test("setting primary amount with an invalid value doesn't change secondary amount", () => {
    const action = setPrimaryAmount({ error: "invalid", value: -1 });

    expect(currencyConverterReducer(mockInitialState, action))
      .toHaveProperty("primaryAmount", -1)
      .toHaveProperty("secondaryAmount", mockInitialState.secondaryAmount);
  });

  test("changing secondary amount, changes primary amount", () => {
    const action = setSecondaryAmount({ value: 5 });
    const rate =
      mockInitialState.conversionRates[mockInitialState.secondaryCurrency]
        .inverseRate;

    expect(currencyConverterReducer(mockInitialState, action))
      .toHaveProperty("secondaryAmount", 5)
      .toHaveProperty("primaryAmount", (5 * rate).toFixed(2));
  });

  test("changing primary currency, changes secondary amount", () => {
    const action = setPrimaryCurrency({ value: "usd" });

    mockInitialState.primaryAmount = 5;

    expect(currencyConverterReducer(mockInitialState, action))
      .toHaveProperty("primaryCurrency", "usd")
      .toHaveProperty("secondaryAmount", 5);
  });

  test("changing secondary currency, changes secondary amount", () => {
    const action = setSecondaryCurrency({ value: "cad" });
    const rate = mockInitialState.conversionRates["cad"].rate;

    mockInitialState.primaryAmount = 5;

    expect(currencyConverterReducer(mockInitialState, action))
      .toHaveProperty("secondaryCurrency", "cad")
      .toHaveProperty("secondaryAmount", (5 * rate).toFixed(2));
  });
});
