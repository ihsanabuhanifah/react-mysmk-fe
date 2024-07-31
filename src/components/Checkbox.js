const Checkbox = ({ onChange, checked, ...props }) => {
  return (
    <input
      {...props}
      onChange={onChange}
      checked={checked}
      type="checkbox"
      name="example"
    />
  );
};

export default Checkbox;
