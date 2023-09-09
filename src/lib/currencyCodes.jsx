export const getCurrencyCodeOptions = () => {
  return fetch("https://www.floatrates.com/daily/gbp.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let codes = [];
      codes.push({ value: "gbp", name: "British Pound Sterling" });
      Object.keys(data).forEach((key, _) => {
        codes.push({
          value: data[key].code.toLowerCase(),
          name: data[key].name,
        });
      });
      return codes;
    });
};
