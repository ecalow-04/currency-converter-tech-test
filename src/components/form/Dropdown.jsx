/**
 * Callback for when a new option is selected
 *
 * @callback handleChange
 * @param {string} value - The value to be sent
 */

/**
 * Dropdown Component
 * @param {string} value - Current value of the dropdown
 * @param {Object[]} options - The selectable options in the dropdown
 * @param {string} options[].value - Sets the value of the option
 * @param {string} options[].name - Sets the text displayed in the option
 * @param {string} [className] - CSS class to apply to dropdown
 * @param {handleChange} handleChange - Callback to be triggered on change
 */

const Dropdown = ({ value, options, className, handleChange }) => {
  return (
    <div>
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
