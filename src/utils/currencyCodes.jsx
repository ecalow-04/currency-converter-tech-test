// util function that is used for getting a list of the available currency codes from the floatrates
// api. I hardcode the british option since that is not included in the gbp conversion rates (makes sense)
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
      codes = codes.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      return codes;
    });
};
