import LayoutSiswa from "../../../module/layoutSiswa";
import { useZUStore } from '../../../zustand/zustore';

export default function DashboardSiswa() {
	const { profile } = useZUStore((state) => state)

  return (
    <LayoutSiswa title='Dashboard'>
      ini dashboard
      <p>data: {profile.nama_siswa}</p>
    </LayoutSiswa>
  );
}
