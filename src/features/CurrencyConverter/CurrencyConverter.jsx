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
import { getCurrencyCodeOptions } from "../../utils/currencyCodes";
import { object, number } from "yup";

const inputSchema = object({
  value: number()
    .typeError("Number input required")
    .min(0, "Value cannot be negative")
    .test(
      "2-dp-exists",
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
    validationErrors,
  } = useSelector((state) => state.currencyConverter);

  // reflects the state of the request to get the currency codes
  const [loadingState, setLoadingState] = useState("loading");
  const [currencyCodes, setCurrencyCodes] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getConversionRatesByCode(primaryCurrency));
      dispatch(setPrimaryAmount({ value: primaryAmount }));
      const data = await getCurrencyCodeOptions();
      setCurrencyCodes(data);
      setLoadingState("success");
    };
    fetchData();
  }, []);

  return (
    <>
      {loadingState == "loading" ? (
        <Spinner />
      ) : (
        <>
          <div className="p-5 bg-gray border-2 rounded-lg">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row w-full space-x-2">
                <Form.Input
                  value={primaryAmount}
                  type="number"
                  placeholder="Enter Amount..."
                  className={
                    "w-full border-gray border-2 dark:border-none h-12 px-2 rounded-md"
                  }
                  validationSchema={inputSchema}
                  handleChange={({ error, value }) =>
                    dispatch(setPrimaryAmount({ error, value }))
                  }
                />
                <Form.Dropdown
                  value={primaryCurrency}
                  options={currencyCodes}
                  className={
                    "w-full truncate border-gray border-2 dark:border-none h-12 px-2 rounded-md"
                  }
                  handleChange={async (value) => {
                    await dispatch(getConversionRatesByCode(value));
                    dispatch(setPrimaryCurrency({ value }));
                  }}
                />
              </div>
              <div className="flex flex-row w-full space-x-2">
                <Form.Input
                  value={secondaryAmount}
                  type="number"
                  placeholder="Enter Amount..."
                  className={
                    "w-full border-gray border-2 dark:border-none h-12 px-2 rounded-md"
                  }
                  validationSchema={inputSchema}
                  handleChange={({ error, value }) =>
                    dispatch(setSecondaryAmount({ error, value }))
                  }
                />
                <Form.Dropdown
                  className={
                    "w-full truncate border-gray border-2 dark:border-none h-12 px-2 rounded-md"
                  }
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
