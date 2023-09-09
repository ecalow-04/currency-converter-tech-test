const Input = ({
  value,
  type,
  placeholder,
  disabled,
  className,
  validationSchema,
  validationError,
  handleChange,
}) => {
  const validate = async (value) => {
    if (!validationSchema) return;

    return validationSchema.validate({ value: value }).then(
      (value) => {
        return value;
      },
      (errors) => {
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
