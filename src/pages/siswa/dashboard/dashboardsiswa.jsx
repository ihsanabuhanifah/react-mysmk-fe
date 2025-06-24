<<<<<<< HEAD
import { Loader } from "semantic-ui-react";
import { useTidakHadir } from "../../../api/siswa/absensi";
=======
import { useSelector } from "react-redux";
>>>>>>> 8aa5b9d538dc49f828db37398416771cb74ea830
import LayoutSiswa from "../../../module/layoutSiswa";
import { useZUStore } from "../../../zustand/zustore";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../../SocketProvider";
import Peer from 'simple-peer';

export default function DashboardSiswa() {
  const { profile } = useZUStore((state) => state);
  const peerRef = useRef();
    const streamRef = useRef();

  const { socket } = useContext(SocketContext);
  const { data, isFetching, isFetched } = useTidakHadir();
  const [RS, setRS] = useState({});

  const   classroomId  = 123
  const studentId = 123
  console.log('data',data)

  useEffect(() => {
    if (data) {
      const rs = data.data.reduce((acc, curr) => {
        acc[curr?.kehadiran?.nama_status_kehadiran] =
          (acc[curr?.kehadiran?.nama_status_kehadiran] || 0) + 1;
        return acc;
      }, {});
      setRS(rs);
    }
  }, [isFetching, data]);



  return (
    <LayoutSiswa title="Dashboard">
<<<<<<< HEAD
      <>
       
        {isFetching ? (
          <div className="ml-5 mt-[30px]">
            <Loader active inline="left" />
          </div>
        ) : (
          <div
            className="mt-4 grid w-full grid-cols-12 grid-rows-6 gap-4 px-5"
            style={{ gridTemplateRows: "70px auto 1fr" }}
          >
            <div className="col-span-12 row-span-1 grid grid-cols-4 gap-2 md:col-span-9">
              <div className="flex h-[70px] flex-row overflow-hidden rounded-md border bg-white">
                <div className="my-auto h-[90%] w-[7px] rounded-r-md bg-blue-500"></div>

                <div className="flex w-full flex-1 flex-col justify-between px-2 pb-2 pt-2">
                  <p className="mb-0 text-body-4 opacity-80">Sakit</p>
                  <p className="mt-0 text-works-title font-black leading-none">
                    {RS["sakit"] ?? 0}
                  </p>
                </div>
              </div>
              <div className="flex h-[70px] flex-row overflow-hidden rounded-md border bg-white">
                <div className="flex w-full flex-1 flex-col justify-between px-2 pb-2 pt-2">
                  <p className="mb-0 text-body-4 opacity-80">Izin Pulang</p>
                  <p className="mt-0 text-works-title font-black leading-none">
                    {RS["izin pulang"] ?? 0}
                  </p>
                </div>

                {/* <div className="w-full h-[4px] bg-blue-500"></div> */}
              </div>
              <div className="flex h-[70px] flex-row overflow-hidden rounded-md border bg-white">
                <div className="flex w-full flex-1 flex-col justify-between px-2 pb-2 pt-2">
                  <p className="mb-0 text-body-4 opacity-80">Dispensasi</p>
                  <p className="mt-0 text-works-title font-black leading-none">
                    {RS["dispensasi"] ?? 0}
                  </p>
                </div>

                {/* <div className="w-full h-[4px] bg-blue-500"></div> */}
              </div>
              <div className="flex h-[70px] flex-row overflow-hidden rounded-md border bg-white">
                <div className="flex w-full flex-1 flex-col justify-between px-2 pb-2 pt-2">
                  <p className="mb-0 text-body-4 opacity-80">Tanpa Ket.</p>
                  <p className="mt-0 text-works-title font-black leading-none">
                    {RS["tanpa keterangan"] ?? 0}
                  </p>
                </div>

                <div className="my-auto h-[90%] w-[7px] rounded-l-md bg-blue-500"></div>
              </div>
            </div>
            <div className="col-span-12 flex flex-col rounded-md border bg-white px-4 pt-5 md:col-span-3 md:h-[280px]">
              {/* <p className="m-0 text-xl font-black opacity-90">
                Jadwal Hari Ini
              </p>
              <div className="mx-auto my-4 h-[1px] w-full rounded-md bg-black/10"></div>

              <div className="mb-2 flex w-full justify-between">
                <p className="font-black text-[#18a558]">Matematika</p>
                <p className="font-black">08:00</p>
              </div>
              <div className="mb-2 flex w-full justify-between">
                <p className="font-black text-[#18a558]">Matematika</p>
                <p className="font-black">08:00</p>
              </div>
              <div className="mb-2 flex w-full justify-between">
                <p className="font-black text-[#18a558]">Matematika</p>
                <p className="font-black">08:00</p>
              </div>
              <div className="mb-2 flex w-full justify-between">
                <p className="font-black text-[#18a558]">Matematika</p>
                <p classNam
                
                e="font-black">08:00</p>
              </div> */}

           
            </div>
          </div>
        )}
      </>
=======
      ini dashboard
      <p>data: {santriProfile.nama_siswa}</p>
>>>>>>> 8aa5b9d538dc49f828db37398416771cb74ea830
    </LayoutSiswa>
  );
}
