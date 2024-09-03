import { useTidakHadir } from "../../../api/siswa/absensi";
import { LoadingPage } from "../../../components";
import LayoutSiswa from "../../../module/layoutSiswa";
import { useZUStore } from '../../../zustand/zustore';

export default function DashboardSiswa() {
	const { profile } = useZUStore((state) => state)
  const { data, isFetching } = useTidakHadir();


  if(isFetching) {
    return <LoadingPage />
  }


  console.log(data)

  return (
    <LayoutSiswa title='Dashboard'>
      <div className="h-full pl-2 pr-5 w-full overflow-y-auto">
        <div className="w-[200px] flex flex-col bg-white border h-[70px] rounded-md overflow-hidden">
        <div className="w-full flex flex-col flex-1 px-2 py-1 gap-2">
          <p className="mb-0 opacity-80">Tidak Hadir</p>
          <p className="text-2xl font-black leading-none mt-0">{data.data.length}</p>
        </div>

        <div className="w-full h-[4px] bg-blue-500"></div>
        </div>
      </div>
    </LayoutSiswa>
  );
}
