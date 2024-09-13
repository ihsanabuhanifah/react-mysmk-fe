import { useNavigate, useParams } from "react-router-dom";
import { useGetHasilPembayaranDetail } from "../../../api/ppdb/pembayaran";

const DetailPembayaran = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetHasilPembayaranDetail(id);

  console.log("Data Detail Pembayaran",data)

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading data.</p>;

  return (
    <div>
      <h1>Detail Pembayaran</h1>
      {data ? (
          <div>
          <p><strong>ID Pembayaran:</strong> {data.id}</p>
          <p><strong>Nominal:</strong> {data.nominal}</p>
          <p><strong>Keterangan:</strong> {data.keterangan}</p>
          <p><strong>Gambar Bukti Transfer:</strong> <a href={data.bukti_tf} target="_blank" rel="noopener noreferrer">Lihat Gambar</a></p>
          <p><strong>Nama Guru:</strong> {data.guru.nama_guru}</p>
          {/* Tambahkan informasi lain sesuai data yang tersedia */}
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default DetailPembayaran;
