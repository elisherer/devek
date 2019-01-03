import { h } from 'hyperapp';
import {Field} from "hyperapp-forms";

const Checkbox = ({ input, name, title, disabled }) => {
  const showError = (input.touched || input.submitted) && !!input.error;
  return (
    <label>
      <input type="checkbox"
             name={name}
             checked={input.value}
             data-error={showError}
             disabled={disabled}
             onchange={input.onchange}
      />
      {showError && <sup>{input.error}</sup>}
      <span>{title}</span>
    </label>
  );
};

export default Field(Checkbox);