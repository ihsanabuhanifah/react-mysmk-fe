import React from "react";
import { Label } from "semantic-ui-react";

export function FormLabel({ label, htmlFor, children, error = false }) {
  return (
    <React.Fragment>
      <div className=" w-full  ">
        <Label
          as={"label"}
          style={{ border: "none", paddingLeft: 0 }}
          basic
          size="large"
          htmlFor={htmlFor}
        >
          {label}
        </Label>
        <div className="w-full ">{children}</div>
        {error && (
          <Label basic size="small" color="red" pointing="above">
            {"Wajib Pilih"}
          </Label>
        )}
      </div>
    </React.Fragment>
  );
}
