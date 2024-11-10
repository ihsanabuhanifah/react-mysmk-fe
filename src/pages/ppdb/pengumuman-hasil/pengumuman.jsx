import { useDetailPembayaran } from "../../../api/ppdb/pembayaran";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useDetailWawancara } from "../../../api/ppdb/wawancara";
import LayoutPpdb from "../../../module/layoutPpdb";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Importing the search icon

const PengumumanHasil = () => {
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const {dataWawancara} = useDetailWawancara();


  // Check if wawancara data is incomplete or the student hasn't passed the interview
  const isLulusIncomplete =
    !dataWawancara || dataWawancara.status_tes === "belum";


  return (
<LayoutPpdb title="Pengumuman Hasil Calon Santri">
  {isLulusIncomplete ? (
    <div className="card bg-red-100 p-4 rounded-md shadow-md">
      <p className="text-red-600 font-semibold">
        Silahkan lakukan Ujian & Wawancara terlebih dahulu!
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <p>Hasil pengumumannya adalah : .....</p>
    </div>
  )}
</LayoutPpdb>
  );
};

export default PengumumanHasil;
