import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "../../components/Form";
import Spinner from "../../components/Spinner";
import {
  setPrimaryAmount,
  setPrimaryCurrency,
  setSecondaryAmount,
  setSecondaryCurrency,
  getConversionRatesByCode,
} from "./currencyConverterSlice";
import { getCurrencyCodeOptions } from "../../lib/currencyCodes";
import { object, number } from "yup";

const inputSchema = object({
  value: number()
    .typeError("Value required")
    .required("Value required")
    .min(0, "Value cannot be negative")
    .test(
      "",
      "Allowed 2 decimal places",
      (value) => !String(value).match(/^\d*\.\d{3,}$/),
    ),
});

const CurrencyConverter = () => {
  const dispatch = useDispatch();
  const {
    primaryAmount,
    primaryCurrency,
    secondaryCurrency,
    secondaryAmount,
    conversionRates,
    ratesLoadingState,
    validationErrors,
  } = useSelector((state) => state.currencyConverter);

  const [loadingState, setLoadingState] = useState("loading");
  const [currencyCodes, setCurrencyCodes] = useState();

  useEffect(() => {
    dispatch(getConversionRatesByCode("gbp"));
    getCurrencyCodeOptions().then((data) => {
      setCurrencyCodes(data);
      setLoadingState("success");
    });
  }, []);

  return (
    <>
      {loadingState == "loading" ? (
        <Spinner />
      ) : (
        <>
          <div className="mx-auto px-5 py-5 bg-gray border-2 rounded-lg my-auto">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row space-x-2">
                <Form.Input
                  value={primaryAmount}
                  type="number"
                  placeholder="Enter Amount..."
                  className={"h-12 px-2 rounded-md"}
                  validationSchema={inputSchema}
                  validationError={validationErrors["primaryAmount"]}
                  handleChange={(change) => dispatch(setPrimaryAmount(change))}
                />
                <Form.Dropdown
                  value={primaryCurrency}
                  options={currencyCodes}
                  className={"h-12 px-2 rounded-md"}
                  handleChange={async (value) => {
                    await dispatch(getConversionRatesByCode(value));
                    dispatch(setPrimaryCurrency({ value }));
                  }}
                />
              </div>
              <div className="flex flex-row space-x-2">
                <Form.Input
                  value={secondaryAmount}
                  type="number"
                  placeholder="Enter Amount..."
                  className={"h-12 px-2 rounded-md"}
                  validationSchema={inputSchema}
                  validationError={validationErrors["secondaryAmount"]}
                  handleChange={(change) =>
                    dispatch(setSecondaryAmount(change))
                  }
                />
                <Form.Dropdown
                  className={"h-12 px-2 rounded-md"}
                  value={secondaryCurrency}
                  options={currencyCodes}
                  handleChange={(value) =>
                    dispatch(setSecondaryCurrency({ value }))
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CurrencyConverter;
