import React from "react";

const CardMapel = ({ _, onClick }) => {
  return (
    <div onClick={onClick} className="flex h-[90px] w-full overflow-hidden rounded-md border cursor-pointer bg-white hover:bg-gray-50 shadow-sm">
      <div className="h-[90px] w-[30%] overflow-hidden bg-gray-100">
        <img
          src={`/mapel/${_.img}.webp`}
          alt={_.nama_mapel}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex h-full flex-grow flex-col justify-center p-2">
        <p className="m-0 text-sm capitalize text-gray-500">{_.is}</p>
        <p className="m-0 text-lg font-semibold text-gray-900">
          {_.nama_mapel}
        </p>
      </div>
    </div>
  );
};

export default CardMapel;
