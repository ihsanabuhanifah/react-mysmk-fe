const Checkbox = ({ onChange, checked }) => {
    return (
      <input
        onChange={onChange}
        checked={checked}
        type="checkbox"
        name="example"
      />
    );
  };


  export default Checkbox