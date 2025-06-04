import { Form } from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { useState } from "react";

import Filter from "./filter";

export default function Raport() {
 

  const [value, setValue] = useState({
    nama_kelas: "",
    tahun_ajaran: "",
    semester: "",
  });
  return (
    <LayoutPage title="raport">
      <Form>
      <Filter value={value} setValue={setValue}/>
      </Form>
    </LayoutPage>
  );
}
