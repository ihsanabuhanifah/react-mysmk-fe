import { Link, useParams } from "react-router-dom";
import { useProfileCalonSantri } from "../../../api/ppdb/profile";
import { useEffect, useState } from "react";
import { getDetailPembayaranById } from "../../../api/ppdb/pembayaran";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const DetailPembayaran = () => {
  const { profileData, isLoading, isError, error } = useProfileCalonSantri();
  const [pembayaranDataDetail, setPembayaranDataDetail] = useState(null);
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState({
    bukti_tf: "",
    keterangan: "Registrasi",
    teacher_id: "",
  });

  const { data: dataPembayaran } = useQuery(
    ["/ppdb/pembayaran-ppdb/detail", id],
    () => getDetailPembayaranById(id),
    {
      onSuccess: (data) => {
        setInitialValues({
          bukti_tf: data.data.bukti_tf || "",
          keterangan: data.data.keterangan || "",
          teacher_id: data.data.teacher_id || "",
        });
      },
      onError: (err) => {
        console.error("Failed to fetch detail pembayaran data:", err);
        toast.error("Gagal mengambil data detail pembayaran", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      },
    }
  );
  return (
    <>
      <Link
        to="#"
        className="flex items-center p-4 my-8 mx-4 text-md text-black hover:text-white bg-gray-300 rounded-lg transition-colors duration-200"
        role="alert"
      >
        <p>Saat ini kami sedang melakukan pengecekan bukti transfer anda</p>
      </Link>

      {/* Card Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Panduan Pembayaran Pendaftaran
        </h2>

        <div className="mb-4">
          <p className="text-gray-700">
            Kepada ananda <span>{profileData?.nama_siswa}</span> harap melunasi
            biaya pendaftaran sebagai syarat untuk bisa mengikuti rangkaian
            proses penerimaan santri baru SMK Madinatul Quran.
          </p>
          <p className="text-gray-700 flex flex-col">
            Nominal yang harus dibayarkan sebesar:
            <span className="font-semibold text-green-600 text-xl">
              450.000
            </span>
          </p>
        </div>

        <div className="flex flex-col items-start mt-4">
          <p className="text-lg font-semibold">
            Untuk pembayarannya dapat dibayarkan ke rekening berikut:
          </p>
          <p className="text-lg font-bold text-gray-500">
            Bank Muamalat
            <br />
            Nomor Rekening: 3310006100
            <br />
            Kode Bank: (147)
            <br />
            Atas Nama: Yayasan Wisata Al Islam
          </p>
        </div>

        <div className="mt-6">
          <p>
            Setelah melakukan pembayaran, mohon untuk melampirkan Bukti Transfer
            melalui menu di bawah ini:
          </p>
        </div>
      </div>

      {/* Lampiran Bukti Transfer Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Detail Pembayaran</h2>

        {pembayaranDataDetail ? (
          <div className="mb-4">
            <p className="text-gray-700">
              Nominal Pembayaran:{" "}
              <span className="font-semibold">
                {pembayaranDataDetail.nominal}
              </span>
            </p>
            <p className="text-gray-700">
              Keterangan: <span>{pembayaranDataDetail.keterangan}</span>
            </p>
            <p className="text-gray-700">
              Status Pembayaran:{" "}
              <span>
                {pembayaranDataDetail.status === 0
                  ? "Belum Dibayar"
                  : "Sudah Dibayar"}
              </span>
            </p>
            <p className="text-gray-700">
              Bukti Transfer:{" "}
              <a
                href={pembayaranDataDetail.bukti_tf}
                target="_blank"
                rel="noopener noreferrer"
              >
                Lihat Bukti Transfer
              </a>
            </p>
          </div>
        ) : (
          <p className="text-gray-700">Sedang memuat detail pembayaran...</p>
        )}
      </div>
    </>
  );
};

export default DetailPembayaran;
