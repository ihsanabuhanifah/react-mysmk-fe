import { useSelector } from "react-redux";
import LayoutSiswa from "../../../module/layoutSiswa";

export default function DashboardSiswa() {
  const santriProfile = useSelector((state) => state.data.profile);

  return (
    <LayoutSiswa title="Dashboard">
      ini dashboard
      <p>data: {santriProfile.nama_siswa}</p>
    </LayoutSiswa>
  );
}
