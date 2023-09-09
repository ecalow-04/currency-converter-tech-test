const Dropdown = ({ value, label, options, className, handleChange }) => {
  return (
    <div>
      <label>{label}</label>
      <select
        defaultValue={value}
        className={className}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      >
        {options?.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Dropdown;
