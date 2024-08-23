import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LayoutPpdb from "../../../module/layoutPpdb";

const DashboardPpdb = () => {
  // const CalonSantriProfile = useSelector((state) => state.data.profile);

  return (
    <LayoutPpdb title="Dashboard">
      <Link
        to="/ppdb/pendaftaran"
        className="flex items-center p-4 mb-4 text-md text-black hover:text-white bg-green-300 rounded-lg hover:bg-green-500 transition-colors duration-200"
        role="alert"
      >
        <p>Silahkan Lengkapi Biodata Diri Anda Terlebih Dahulu!</p>
      </Link>
      <p>ini halaman dashboard ppdb</p>

      {/* <p>data: {CalonSantriProfile.nama_siswa}</p> */}
    </LayoutPpdb>
  );
};

export default DashboardPpdb;
