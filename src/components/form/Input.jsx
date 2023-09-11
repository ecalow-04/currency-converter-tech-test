import { useState, useEffect } from "react";

/**
 * Callback for when the input is typed in
 *
 * @callback handleChange
 * @param {Object} object
 * @param {string} object.value - The value to be set
 * @param {string} object.error - Error message if validation schema failed
 */

/**
 * Input Component
 *
 * @param {string} value - Current value of the input
 * @param {string} type - Input type, e.g. 'number' or 'text'
 * @param {string} [placeholder] - Text to display when the value is empty
 * @param {boolean} [disabled] - Set whether the input can be changed or not
 * @param {string} [className] - CSS class to apply to the input
 * @param [validationSchema] - Yup object to validate against input
 * @param {handleChange} handleChange - Callback to be triggered on change
 */

const Input = ({
  value,
  type,
  placeholder,
  disabled,
  className,
  validationSchema,
  handleChange,
}) => {
  const [validationError, setValidationError] = useState();

  useEffect(() => {
    validate(value);
  }, [value]);

  const validate = async (value) => {
    if (!validationSchema) return;

    return validationSchema.validate({ value: value }).then(
      (value) => {
        setValidationError();
        return value;
      },
      (errors) => {
        setValidationError(errors.message);
        return { value, error: errors.message };
      },
    );
  };

  return (
    <div>
      <input
        className={
          validationError
            ? `${className} ring ring-red-500 focus:outline-none`
            : className
        }
        value={value}
        type={type}
        placeholder={placeholder}
        onKeyDown={(evt) => {
          // put this in as when pressing any characters that respresent numerical values or a mathematical sign, it would clear the input
          if (type == "number") {
            ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault();
          }
        }}
        onChange={async (event) => {
          const result = await validate(event.target.value);
          handleChange(result);
        }}
        disabled={disabled}
      />
      {validationError && (
        <p className="mt-1 text-red-400 text-sm">{validationError}</p>
      )}
    </div>
  );
};

export default Input;
