import { h } from 'hyperapp';
import {Field} from "hyperapp-forms";

const Textbox = ({ input, type, name, title, disabled }) => {
  const showError = (input.touched || input.submitted) && !!input.error;
  return (
    <label>
      <input type={type}
             name={name}
             value={input.value}
             data-fixed={!!input.value}
             data-error={showError}
             disabled={disabled}
             onchange={input.onchange}
             onfocus={input.onfocus}
      />
      <span>{title}</span>
      {showError && <sup>{input.error}</sup>}
    </label>
  );
};

export default Field(Textbox);