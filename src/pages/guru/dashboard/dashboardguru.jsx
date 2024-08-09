import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";

export default function DashboardGuru() {
  let navigate = useNavigate();

  return (
    <LayoutPage title='Dashboard'>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white shadow rounded-xl w-full flex flex-col p-5">
            <h1 className="font-bold text-base leading-none">Total Pengajar</h1>
            <p className="text-xl leading-none font-bold text-green-500">5 Guru</p>
          </div>
          <div className="bg-white shadow rounded-xl w-full flex flex-col p-5">
            <h1 className="font-bold text-base leading-none">Total Murid</h1>
            <p className="text-xl leading-none font-bold text-green-500">5 Guru</p>
          </div>
          <div className="bg-white shadow rounded-xl w-full flex flex-col p-5">
            <h1 className="font-bold text-base leading-none">Total Pengampu halaqoh</h1>
            <p className="text-xl leading-none font-bold text-green-500">5 Guru</p>
          </div>
          <div className="bg-white shadow rounded-xl w-full flex flex-col p-5">
            <h1 className="font-bold text-base leading-none">Total Pengajar</h1>
            <p className="text-xl leading-none font-bold text-green-500">5 Guru</p>
          </div>
          
        </div>
      </div>
    </LayoutPage>
  );
}
