/* eslint-disable no-unused-vars */
import { Button, Icon } from "semantic-ui-react";
export function EditButton({ onClick, disabled, size = "small" }) {
  return (
    <button
      className="bg-none"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon size={size} disabled={disabled} name="edit" color="teal" />
    </button>
  );
}


export function CopyButton({ onClick, disabled, size = "small" }) {
  return (
    <button
      className="bg-none"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon size={size} disabled={disabled} name="copy" color="teal" />
    </button>
  );
}
export function AddButton({ onClick, disabled, size = "small" }) {
  return (
    <button
      className="bg-none"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon size={size} disabled={disabled} name="add" color="teal" />
    </button>
  );
}

export function DeleteButton({ onClick, disabled, size = "small" }) {
  return (
    <button
      compact
      className="bg-none"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon size={size} disabled={disabled} name="trash" color="red" />
    </button>
  );
}

export function ViewButton({ onClick, disabled, size = "small" }) {
  return (
    <button
      compact
      className="bg-none"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon size={size} disabled={disabled} name="eye" color="blue" />
    </button>
  );
}

export function BackButton({ onClick, disabled, size = "small" }) {
  return (
    <button
      compact
      className="bg-none"
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <Icon
        size={size}
        
        disabled={disabled}
        name="arrow left"
        color="blue"
      />
    </button>
  );
}