import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";

export default function DashboardGuru() {
  let navigate = useNavigate();

  return (
    <LayoutPage title='Dashboard'>
      ini dashboard
    </LayoutPage>
  );
}
