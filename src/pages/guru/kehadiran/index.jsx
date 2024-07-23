import { useNavigate } from "react-router-dom";
import LayoutPage from "../../../module/layoutPage";
import { useEffect, useState } from "react";
import { Form, Tab, Table, Input, Icon, Button } from "semantic-ui-react";
import {
  useKehadiran,
  useSubmitDatang,
  useSubmitPulang,
} from "../../../api/guru/absensi";
import { TableLoading } from "../../../components";
import { showFormattedDate } from "../../../utils";
import dayjs from "dayjs";
import { useAuthMe } from "../../../api/auth";
import { toast } from "react-toastify";
import ModalIzin from "./Modal";
export default function Kehadiran() {
  const [userLocation, setUserLocation] = useState(null);
  const { dataMe } = useAuthMe();
  const [open, setOpen] = useState(false)
  const [jarak, setJarak] = useState(1000);
  let [tanggalActive, setTanggalActive] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  //   function haversineDistance(lat1, lon1, lat2, lon2) {
  //     const R = 6371; // Radius of the Earth in kilometers
  //     const lat1Rad = toRadians(lat1);
  //     const lat2Rad = toRadians(lat2);
  //     const deltaLat = toRadians(lat2 - lat1);
  //     const deltaLon = toRadians(lon1 - lon2);

  //     const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
  //               Math.cos(lat1Rad) * Math.cos(lat2Rad) *
  //               Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //     const distance = R * c; // Distance in kilometers
  //     return distance;
  // }

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the Earth in meters
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon1 - lon2);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance;
  }
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setUserLocation({ latitude, longitude });
        },

        (error) => {
          console.error("Error get user location: ", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation?.latitude) {
      const a = haversineDistance(
        //   -6.493519999999999,
        //   107.0082512,
        userLocation.latitude,
        userLocation.longitude,
        -6.4935542,
        107.0082822
      );

      setJarak(a);
    }
  }, [userLocation]);

  const { data, isFetching } = useKehadiran({
    tanggal: tanggalActive,
  });
  const datang = useSubmitDatang({ tanggal: tanggalActive });
  const pulang = useSubmitPulang({ tanggal: tanggalActive });

  return (
    <LayoutPage title="Kehadiran Guru">
        <ModalIzin open={open} setOpen={setOpen} tanggalActive={tanggalActive}/>
      <section className="mt-5">
        {jarak > 10 && (
          <div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">Warning !</div>
            ABSENSI bisa dilakukan jika jarak kurang dari 10 meter dari lokasi
            absensi SMK MADINATULQURAN. Saat ini Anda Berada pada jarak{" "}
            {Math.ceil(jarak)} meter. <br />{" "}
            <button
              onClick={() => {
                const a = haversineDistance(
                //   -6.493519999999999,
                //   107.0082512,
                  userLocation.latitude,
                  userLocation.longitude,
                  -6.4935542,
                  107.0082822
                );

                setJarak(a);
              }}
              className="border rounded-md bg-green-500 hover:bg-green-100 px-4 py-2 text-white"
            >
              Perbaharui Lokasi
            </button>
          </div>
        )}
        <Form>
          <section className="grid sm:grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="col-span-1 ">
              <Form.Field
                control={Input}
                name="tanggal"
                onChange={(e) => {
                  setTanggalActive(e.target.value);
                }}
                value={tanggalActive}
                type="date"
              />
            </div>

            <div>
              <Button
                content={"Absensi Kedatangan"}
                type="button"
                fluid
                icon={() => <Icon name="sign-in" />}
                size="medium"
                color="teal"
                loading={datang.isLoading}
                disabled={
                  datang.isLoading ||
                  jarak > 10 ||
                  !!data?.data?.filter(
                    (item) =>
                      Number(item.teacher.user_id) === Number(dataMe.user.id)
                  )?.[0]?.status === true
                }
                onClick={() => {
                  datang.mutate();
                }}
              />
            </div>

            <div>
              <Button
                content={"Absensi Kepulangan"}
                type="button"
                fluid
                icon={() => <Icon name="sign-out" />}
                size="medium"
                color="blue"
                loading={pulang.isLoading}
                disabled={pulang.isLoading || jarak > 10 ||  !!data?.data?.filter(
                    (item) =>
                      Number(item.teacher.user_id) === Number(dataMe.user.id)
                  )?.[0]?.jam_pulang === true}
                onClick={() => {
                  if (
                    data?.data?.filter(
                      (item) =>
                        Number(item.teacher.user_id) === Number(dataMe.user.id)
                    )?.[0]?.status !== "hadir"
                  ) {
                    return toast.warning("Jam Kedatangan Belum Absensi", {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                    });
                  }
                  pulang.mutate();
                }}
              />
            </div>
            <div>
              <Button
                content={"Izin Ketidakhadiran"}
                type="button"
                fluid
                icon={() => <Icon name="edit outline" />}
                size="medium"
                color="red"
                
                onClick={() => {
                 setOpen(true)
                }}
              />
            </div>
          </section>
        </Form>
        {/* <p className="font-bold text-red-500">{jarak}</p>
      {JSON.stringify(userLocation)}
      <button
        onClick={() => {
          const a = haversineDistance(
            -6.493519999999999,
            107.0082512,
            -6.4935542,
            107.0082822
          );

          setJarak(a);
        }}
      >
        Konfirmasi Kehadiran
      </button> */}
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>No</Table.HeaderCell>
              <Table.HeaderCell>Tanggal</Table.HeaderCell>

              <Table.HeaderCell>Nama</Table.HeaderCell>
              <Table.HeaderCell>Jam Datang</Table.HeaderCell>
              <Table.HeaderCell>Jam Pulang</Table.HeaderCell>
              <Table.HeaderCell>Status Kehadiran</Table.HeaderCell>
              <Table.HeaderCell>Keterangan</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TableLoading
              count={8}
              isLoading={isFetching}
              data={data?.data}
              messageEmpty={"Absensi Kehadiran Tanggal ini tidak ditemukan"}
            >
              {data?.data?.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell>{showFormattedDate(item.tanggal)}</Table.Cell>
                  <Table.Cell>{item.teacher.nama_guru}</Table.Cell>
                  <Table.Cell>{item.jam_datang || "-"}</Table.Cell>
                  <Table.Cell>{item.jam_pulang || "-"}</Table.Cell>
                  <Table.Cell>{item.status || "-"}</Table.Cell>
                  <Table.Cell>{item.keterangan || "-"}</Table.Cell>
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </section>
    </LayoutPage>
  );
}
