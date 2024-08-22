import React, { useState } from "react";
import { useLaporanPklDetail } from "../../../api/siswa/laporan-pkl";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Dimmer,
  Divider,
  Header,
  Icon,
  Loader,
  Placeholder,
  Segment,
} from "semantic-ui-react";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import { useNavigate, useParams } from "react-router-dom";

const DetailLaporan = () => {
  const { id } = useParams();
  const { data, isFetching, isLoading } = useLaporanPklDetail(id);
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading || isFetching) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
        }}
        className="fixed flex items-center justify-center"
      >
        <div>
          <Dimmer
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)", // semi-transparent white
              backdropFilter: "blur(0.5px)", // applies blur effect
            }}
            active
            inverted
          >
            <Loader size="large">Loading data ... </Loader>
          </Dimmer>
        </div>
      </div>
    );
  }

  return (
    <LayoutSiswa title="Detail Laporan Santri">
      <div className="flex flex-col gap-y-4 overflow-y-auto pb-10 w-full h-full pl-2 pr-5">
        {" "}
        <Icon
          name="arrow left"
          size="large"
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <div className="text-center mb-6">
          <h1 className="text-green-800 text-2xl font-bold">
            {data.siswa.nama_siswa}
          </h1>
        </div>
        <Segment className="w-full h-full overflow-y-auto">
          <Header as="h2" textAlign="center">
            {data.status === "hadir"
              ? `Laporan tanggal ${formatTanggalIndo(data.tanggal)}`
              : `Izin pada tanggal ${formatTanggalIndo(data.tanggal)}`}
          </Header>
          <Divider />
          <div className="flex justify-center mb-6">
            {!isImageLoaded && (
              <Placeholder style={{ width: "100%", height: "300px" }}>
                <Placeholder.Image square />
              </Placeholder>
            )}
            <img
              src={data.foto}
              style={{ display: isImageLoaded ? "block" : "none" }}
              alt={`Foto Laporan Kegiatan ${data.siswa.nama_siswa} tanggal ${data.tanggal}`}
              className={`w-full max-w-4xl h-[300px] rounded-lg  object-cover  transition-opacity duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => {
                console.log("imageee ");
                setIsImageLoaded(true);
                console.log("imageee aaaaaa");
              }}
            />
          </div>
          <div className="text-center mb-4 ">
            <h2 className="text-4xl font-semibold ">{data.judul_kegiatan}</h2>
          </div>
          <div className="text-left">
            <p className="text-xl">
              {" "}
              <span className="font-bold text-2xl">
                {data.status === "hadir" ? "ISI LAPORAN" : "Deskripsi Izin"}
              </span>{" "}
              {data.isi_laporan}
            </p>
          </div>
        </Segment>
      </div>
    </LayoutSiswa>
  );
};

export default DetailLaporan;
