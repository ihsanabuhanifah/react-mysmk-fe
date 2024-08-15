import React from "react";
import {
  ItemImage,
  ItemGroup,
  ItemContent,
  Item,
  Segment,
  Loader,
  Dimmer,
} from "semantic-ui-react";
import { Button, Icon } from "semantic-ui-react";

const Card = ({ item, isFetching, isLoading }) => {
  return (
    <>
      {isLoading === true ? (
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
        </Segment>
      ) : (
        <ItemGroup divided>
          <Segment className="w-full flex justify-between items-center h-full">
            <div className="w-1/2 flex gap-5 items-center h-full">
              <img
                src={item.foto}
                alt={`foto jurnal pkl ${item.siswa.nama_siswa} pada tanggal ${item.tanggal}`}
                className="w-24 h-24 rounded-xl bg-cover"
              />
              <div>
                <h2 className="uppercase ">{item.judul_kegiatan}</h2>
                <p className="text-sm text-gray-500">{item.tanggal}</p>
              </div>
            </div>
            <div className="flex gap-5 items-center h-full">
              <Button color="instagram">Laporan Diniyyah</Button>
              <Button icon className="p-2">
                <Icon name="edit" />
              </Button>
            </div>
          </Segment>
        </ItemGroup>
      )}
    </>
  );
};

export default Card;
