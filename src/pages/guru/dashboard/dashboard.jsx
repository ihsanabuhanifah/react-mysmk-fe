import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import MapComponent from "../../../components/geocode";
import { Autoplace } from "../../../components/autoPlace";
export default function Dashboard() {
  let navigate = useNavigate();
  return (
    <LayoutPage title='Dashboard'>
      ini dashboard
      <MapComponent></MapComponent>
      <div className="bg-gray-300">

      </div>
      {/* <Autoplace></Autoplace> */}
    </LayoutPage>
  );
}
