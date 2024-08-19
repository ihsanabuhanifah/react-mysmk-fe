import React, { useState } from "react";
import {
  ItemGroup,
  Segment,
  Button,
  Icon,
  Placeholder,
} from "semantic-ui-react";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import { useNavigate } from "react-router-dom";

const Card = ({ item }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();

  return (
    <ItemGroup divided className="hover:shadow-md">
      <Segment className="w-full flex justify-between items-center h-full cursor-pointer">
        <div className="w-1/2 flex gap-5 items-center h-full">
          {/* Shimmer effect while image is loading */}
          {!isImageLoaded && (
            <Placeholder style={{ width: "96px", height: "96px" }}>
              <Placeholder.Image square />
            </Placeholder>
          )}
          <img
            src={item.foto}
            alt={`foto jurnal pkl ${item.siswa.nama_siswa} pada tanggal ${item.tanggal}`}
            className={`w-24 h-24 rounded-xl bg-cover transition-opacity duration-500 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            style={{ display: isImageLoaded ? "block" : "none" }}
          />
          <div>
            <h2
              className="uppercase line-clamp-1 hover:underline"
              onClick={() => navigate(`/siswa/laporan-pkl/detail/${item.id}`)}
            >
              {item.judul_kegiatan}
            </h2>
            <p className="text-sm text-gray-500">
              {formatTanggalIndo(item.tanggal)}
            </p>
          </div>
        </div>
        <div className="flex gap-5 items-center h-full">
          <Button primary onClick={() => navigate("/siswa/laporan-pkl/laporan-diniyyah")}>Laporan Diniyyah</Button>
          <Button icon className="p-2" onClick={() => navigate(`/siswa/laporan-pkl/update/${item.id}`)}>
            <Icon name="edit" />
          </Button>
        </div>
      </Segment>
    </ItemGroup>
  );
};

export default Card;
