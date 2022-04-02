import React from "react";
import { Input, Form } from "semantic-ui-react";
import { FormLabel } from "../../../components";
import InputDateRange from "../../../components/inputDateRange";

let payload = {
  date: [[new Date(), new Date()]],
};

export default function FilterPerizinanPulang() {
  const [value, onChange] = React.useState([new Date(), new Date()]);
  return (
    <React.Fragment>
     <div className="grid grid-cols-3  gap-5 w-full">
     <FormLabel htmlFor={"tanggal"} label="Tanggal">
        <InputDateRange value={value} onChange={onChange} rangeDivider="to" />
      </FormLabel>
      <FormLabel htmlFor={"Status"} label="Status">
        <Input fluid placeholder="ok" />
      </FormLabel>
      <FormLabel htmlFor={"Status"} label="Status">
        <Input fluid placeholder="ok" />
      </FormLabel>
      <FormLabel htmlFor={"Status"} label="Status">
        <Input placeholder="ok" />
      </FormLabel>
     </div>
    </React.Fragment>
  );
}
