import React, { useState } from "react";
import {
  ItemGroup,
  Segment,
  Button,
  Icon,
  Placeholder,
  Image,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { formatTanggalIndo } from "../utils/formatTanggal";

const Card = ({ item }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");

  const isSameDay = item.tanggal === today;

  return (
    <ItemGroup divided className="hover:shadow-md w-full">
      <Segment
        raised
        className="w-full flex flex-col md:flex-row justify-between items-center h-full cursor-pointer"
      >
        <div className="flex gap-5 items-center w-full">
          {/* Shimmer effect while image is loading */}
          {!isImageLoaded && (
            <Placeholder style={{ width: "120px", height: "120px" }}>
              <Placeholder.Image square />
            </Placeholder>
          )}
          <Image
            size="small"
            label={{
              size: "tiny",
              as: "a",
              color: item.status === "hadir" ? "green" : "red",
              content: item.status,
              icon: item.status === "hadir" ? "calendar check outline" : "calendar times outline",
              ribbon: true,
            }}
            src={item.foto}
            alt={`foto jurnal pkl ${item.siswa.nama_siswa} pada tanggal ${item.tanggal}`}
            className={`w-32 h-32 rounded-xl bg-cover flex-shrink-0 transition-opacity duration-500 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            style={{ display: isImageLoaded ? "block" : "none" }}
          />
          <div className="flex flex-col flex-grow">
            <h2
              className="uppercase line-clamp-1 hover:underline"
              onClick={() => navigate(`/guru/laporan-pkl/detail/${item.id}`)}
            >
              {item.judul_kegiatan}
            </h2>
            <p className="text-sm text-gray-500">
              {formatTanggalIndo(item.tanggal)}
            </p>
            <p className="text-sm text-gray-700">
              Nama Siswa: <strong>{item.siswa.nama_siswa}</strong>
            </p>
          </div>
        </div>
        {/* <div className="flex gap-2 mt-4 md:mt-0 items-center justify-end w-full md:w-auto">
          <Button
            className="w-auto"
            primary
            disabled={!isSameDay}
            onClick={() =>
              navigate(`/guru/laporan-pkl/laporan-diniyyah/${item.id}`)
            }
          >
            Laporan Diniyyah
          </Button>
          
          <Button
            icon
            className="p-2 w-auto"
            onClick={() => navigate(`/guru/laporan-pkl/update/${item.id}`)}
          >
            <Icon name="edit" />
          </Button>
        </div> */}
      </Segment>
    </ItemGroup>
  );
};

export default Card;
