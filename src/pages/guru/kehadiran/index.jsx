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
import { checkRole, showFormattedDate } from "../../../utils";
import dayjs from "dayjs";
import { useAuthMe } from "../../../api/auth";
import { toast } from "react-toastify";
import ModalIzin from "./Modal";
import useList from "../../../hook/useList";
import ModalKepulangan from "./ModalKepulangan";
export default function Kehadiran() {
  const [userLocation, setUserLocation] = useState(null);
  const { dataMe } = useAuthMe();

  const { roles } = useList();
  const [open, setOpen] = useState(false);
  const [openPulang, setOpenPulang] = useState(false);
  const [jarak, setJarak] = useState(100000000);
  let [id, setId] = useState(0);
  let [tanggalActive, setTanggalActive] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
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
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setUserLocation({ latitude, longitude });
          console.log("jalan", latitude, longitude);
        },

        (error) => {
          console.error("Error get user location: ", error);
        },
        {
          enableHighAccuracy: true, // Memastikan akurasi tinggi
          timeout: 5000, // Timeout dalam milidetik
          maximumAge: 0, // Jangan menggunakan cache lokasi
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

  return (
    <LayoutPage title="Kehadiran Guru">
      <ModalIzin
        id={id}
        open={open}
        setOpen={setOpen}
        tanggalActive={tanggalActive}
        setId={setId}
      />
      <ModalKepulangan
        open={openPulang}
        setOpen={setOpenPulang}
        tanggalActive={tanggalActive}
      />
      
      <section>
        {jarak > 50 && (
          <div class="ui warning message">
            <i class="close icon"></i>
            <div class="header">Warning !</div>
            ABSENSI bisa dilakukan jika jarak kurang dari 10 meter dari lokasi
            absensi SMK MADINATULQURAN. Saat ini Anda Berada pada jarak{" "}
            {Math.ceil(jarak)} meter. <br />{" "}
            
          </div>
        )}
        {JSON.stringify(userLocation)}
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

            {console.log(
              "dd",
              dayjs(
                data?.data?.filter(
                  (item) =>
                    Number(item.teacher.user_id) === Number(dataMe.user.id)
                )?.[0]?.tanggal
              ).format("YYYY-MM-DD"),
              dayjs().format("YYYY-MM-DD")
            )}
            {dayjs(
              data?.data?.filter(
                (item) =>
                  Number(item.teacher.user_id) === Number(dataMe.user.id)
              )?.[0]?.tanggal
            ).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD") && (
              <>
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
                      jarak > 50 ||
                      !!data?.data?.filter(
                        (item) =>
                          Number(item.teacher.user_id) ===
                          Number(dataMe.user.id)
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
                    disabled={
                      jarak > 50 ||
                      !!data?.data?.filter(
                        (item) =>
                          Number(item.teacher.user_id) ===
                          Number(dataMe.user.id)
                      )?.[0]?.jam_pulang === true
                    }
                    onClick={() => {
                      if (
                        data?.data?.filter(
                          (item) =>
                            Number(item.teacher.user_id) ===
                            Number(dataMe.user.id)
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
                      return setOpenPulang(true);
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
                      setOpen(true);
                    }}
                  />
                </div>
              </>
            )}
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

              {checkRole(roles, "admin") && (
                <Table.HeaderCell>Aksi</Table.HeaderCell>
              )}
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
                  {checkRole(roles, "admin") && (
                    <Table.Cell>
                      {" "}
                      <Button
                        content={"Absen"}
                        type="button"
                        fluid
                        size="medium"
                        color="red"
                        onClick={() => {
                          setId(item.teacher.id);
                          setOpen(true);
                        }}
                      />
                    </Table.Cell>
                  )}
                </Table.Row>
              ))}
            </TableLoading>
          </Table.Body>
        </Table>
      </section>
    </LayoutPage>
  );
}
