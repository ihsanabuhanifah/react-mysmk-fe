import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import MapComponent from "../../../components/geocode";
export default function Dashboard() {
  let navigate = useNavigate();
  return (
    <LayoutPage title='Dashboard'>
      ini dashboard
      <MapComponent></MapComponent>
    </LayoutPage>
  );
}
