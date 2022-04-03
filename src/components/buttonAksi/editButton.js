import { Button, Icon } from "semantic-ui-react";
export function EditButton({ onClick, disabled, size = 'small' }) {
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

export function DeleteButton({ onClick, disabled, size = 'small' }) {
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


export function ViewButton({ onClick, disabled,size = 'small' }) {
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