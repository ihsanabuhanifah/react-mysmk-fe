import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import CnthChart from "../../../components/testChart";

export default function DashboardGuru() {
  let navigate = useNavigate();

  return (
    <LayoutPage title="Dashboard">
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex flex-col flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white shadow rounded-xl w-full flex flex-col relative">
              <div className="flex flex-col p-5 pl-6">
                <h1 className="font-bold text-base leading-none">
                  Total Murid
                </h1>
                <p className=" leading-none font-bold text-green-500 text-sm sm:text-xl">
                  83 Santri
                </p>
              </div>
              <div className="absolute h-4/5 w-2 top-1/2 -translate-y-1/2 left-0 bg-green-500 rounded-tr-lg rounded-br-lg"></div>
            </div>

            <div className="bg-white shadow rounded-xl w-full flex flex-col relative ">
              <div className="flex flex-col p-5 pr-6">
                <h1 className="font-bold text-base leading-none">
                  Jadwal Selanjutnya
                </h1>
                <div className="w-full flex flex-row justify-between h-fit text-sm sm:text-xl">
                  <div className=" ">
                    <p className=" leading-none font-bold text-yellow-500">
                      Matematika
                    </p>
                  </div>
                  <p className=" leading-none font-bold text-yellow-500">
                    08:00
                  </p>
                </div>
              </div>
              <div className="absolute h-4/5 w-2 top-1/2 -translate-y-1/2 right-0 bg-yellow-500 rounded-tl-lg rounded-bl-lg"></div>
            </div>
          </div>
          <div className="p-5 shadow rounded-xl mt-3 ">
            <p className="text-xl font-bold">Frequen Absen</p>
            <div className="h-96">
              <CnthChart />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full sm:w-96 gap-5">
          <div className="h-fit shadow w-full rounded-xl flex flex-col p-5">
            <h1 className="text-xl font-bold border-b-2 border-gray-100 pb-3">
              Materi yang diampu
            </h1>
            <div className="flex flex-col w-full">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  className="w-full p-2 hover:bg-green-100/50 transition-all duration-150 rounded "
                  key={i}
                >
                  <p className="text-green-500 font-bold">Matematika</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-96 shadow w-full rounded-xl flex flex-col p-5">
            <h1 className="text-xl font-bold border-b-2 border-gray-100 pb-3">
              Jadwal hari Ini{" "}
            </h1>
            <div className="flex flex-col w-full">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  className="w-full px-2 py-3  hover:bg-green-100/50 transition-all duration-150 rounded flex flex-row justify-between items-center  "
                  key={i}
                >
                  <div className="">
                    <p className=" font-bold text-green-500 leading-none">
                      Matematika
                    </p>
                  </div>
                  <p className=" font-bold leading-none">08:00</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
