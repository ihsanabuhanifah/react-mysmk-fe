import React from "react";
import LayoutSiswa from "../../../module/layoutSiswa";
import {
  Button,
  Dimmer,
  Icon,
  Image,
  Loader,
  Placeholder,
  PlaceholderLine,
  Segment,
} from "semantic-ui-react";
import { useLaporanPklList } from "../../../api/siswa/laporan-pkl";
import Card from "./Card";
import { useNavigate } from "react-router-dom";

const LaporanPkl = () => {
  const { data, isFetching, isLoading } = useLaporanPklList();
  console.log(isFetching, "ispetching");
  let navigate = useNavigate();
  return (
    <LayoutSiswa title="Laporan Pkl">
      <Button
        color="green"
        size="medium"
        onClick={() => navigate("/siswa/laporan-pkl/create")}
      >
        Buat Laporan
      </Button>
      <div className="md:mt-8 mt-6">
        {isFetching ? (
          <Segment className="h-full w-full">
            <Dimmer active inverted>
              <Loader size="medium">Loading</Loader>
            </Dimmer>
            <Placeholder>
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
            </Placeholder>
          </Segment>
        ) : (
          data &&
          data.data.map((item, index) => (
            <React.Fragment key={index}>
              <Card isFetching={isFetching} isLoading={isLoading} item={item} />
            </React.Fragment>
          ))
        )}
      </div>
    </LayoutSiswa>
  );
};

export default LaporanPkl;
