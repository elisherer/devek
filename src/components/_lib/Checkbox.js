import styled from "styled-components";

const Mark = styled.span`
  position: absolute;
  top: 2px;
  left: 2px;
  height: 20px;
  width: 20px;
  border: 1px solid ${({ theme }) => theme.greyBorder};
  border-radius: 5px;
  background-color: ${({ theme }) => theme.inputBackground};

  &:after {
    content: "";
    position: absolute;
    display: none;

    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid ${({ theme }) => theme.secondaryColor};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
`;

const CheckboxLabel = styled.label`
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;

    &:focus ~ ${Mark} {
      border-color: ${({ theme }) => theme.inputFocusBorder};
    }

    &:checked ~ ${Mark}:after {
      display: block;
    }
  }
`;

const Checkbox = ({ label, children, ...props }: { label: string, children: any, id: string }) => (
  <CheckboxLabel htmlFor={props.id}>
    {children || label}
    <input type="checkbox" {...props} />
    <Mark />
  </CheckboxLabel>
);

export default Checkbox;
