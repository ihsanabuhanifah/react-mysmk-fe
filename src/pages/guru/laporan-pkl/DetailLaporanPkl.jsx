import React, {  useState } from "react";
import {
  Dimmer,
  Divider,
  Header,
  Icon,
  Loader,
  Placeholder,
  Segment,
  Table,
} from "semantic-ui-react";
import { formatTanggalIndo } from "../../../utils/formatTanggal";
import { useNavigate, useParams } from "react-router-dom";
import { DetailLaporanPkl } from "..";
import LayoutPage from "../../../module/layoutPage";
import { useQuery, useQueryClient } from "react-query";
import { detailLaporanPkl, downloadPdf, useDownloadPdf, useDownloadPdfBulanan } from "../../../api/guru/laporanharianpkl";

export default function DetailLaporan() {
  const { id } = useParams();
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { mutate: downloadPdfBulananIsMutate, isLoading: downloadPdfBulananIsLoading } = useDownloadPdfBulanan(id);
  const { mutate: downloadPdfIsMutate, isLoading: downloadPdfIsLoading } = useDownloadPdf(id);
  let { data, isFetching, isLoading } = useQuery(
    //query key
    ["/tempat-pkl/update", id],
    //axios function,triggered when page/pageSize change
    () => detailLaporanPkl(id),
    //configuration
    {
      // refetchInterval: 1000 * 60 * 60,
      enabled: id !== undefined,
      select: (response) => {
      
        return response.data.data;

      },
      onSuccess: (data) => {
       
        // data.soal = JSON.parse(data.soal);


      },
    }
  );

  //   useEffect(() => {
  //     if(!!data === true){
  //       setInitialState({
  //         ...data,
  //         nama_siswa : {
  //           value : data.student_id,
  //           label : data.siswa.nama_siswa
  //         }
  //       });
  //     }
  //   }, [data])
  if (isFetching) {
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
        <Dimmer
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(0.5px)",
          }}
          active
          inverted
        >
          <Loader size="large">Loading data ... </Loader>
        </Dimmer>
      </div>
    );
  }

  const laporanDiniyyah = data?.laporan_diniyyah_harian?.[0];

  return (
    <LayoutPage title="Detail Laporan Santri">
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-y-4 my-5 pb-10 w-full h-full pl-2 pr-5">
          <div className="flex flex-row justify-start items-center" onClick={() => navigate('/guru/laporan-pkl/')}>
            <Icon
              name="arrow left"
              size="large"

              className="cursor-pointer"
            />
            <p className="text-xl  font-semibold text-black cursor-pointer">Kembali</p>
          </div>
          <Segment loading={isLoading || isFetching}>
            <div className="text-center mb-6">
              <h1 className="text-green-800 text-2xl font-bold">
                {data?.siswa?.nama_siswa}
              </h1>
            </div>
            <Divider></Divider>
            <Header as="h2" textAlign="center">
              {data?.status === "hadir"
                ? `Laporan tanggal ${formatTanggalIndo(data?.tanggal)}`
                : `Izin pada tanggal ${formatTanggalIndo(data?.tanggal)}`}
            </Header>
            <Divider />
            <div className="flex justify-center mb-6">
              {!isImageLoaded && (
                <Placeholder style={{ width: "100%", height: "300px" }}>
                  <Placeholder.Image square />
                </Placeholder>
              )}
              <img
                src={data?.foto}
                style={{ display: isImageLoaded ? "block" : "none" }}
                alt={`Foto Laporan Kegiatan ${data?.siswa?.nama_siswa} tanggal ${data?.tanggal}`}
                className={`w-full max-w-4xl h-[300px] rounded-lg object-contain transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            <div className="text-center mb-4 ">
              <h2 className="text-4xl font-semibold ">
                {data?.judul_kegiatan || "Belum ada judul kegiatan"}
              </h2>
            </div>

            <div className="text-left">
              <p className="text-xl">
                {" "}
                <span className="font-bold text-2xl">
                  {data?.status === "hadir" ? "ISI LAPORAN" : "Deskripsi Izin"}
                </span>{" "}
                {data?.isi_laporan || "Belum ada isi laporan"}
              </p>
            </div>
            
            {/* <div className="col-span-6 lg:col-span-1 xl:col-span-1">
              <Button size="medium" color="blue" onClick={() => downloadPdfBulananIsMutate(id)} disabled={downloadPdfBulananIsLoading} >
                {
                  downloadPdfBulananIsLoading ? 'Loading' : (
                    <>
                      <Icon name="download" /> donwload PDF bulanan
                    </>
                  )
                }
              </Button>
              
            </div> */}
          </Segment>
          <Segment>
            <div className="text-left mb-4">
              <h3 className="text-2xl font-semibold">Laporan Diniyyah</h3>
              {laporanDiniyyah ? (
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Judul</Table.HeaderCell>
                      <Table.HeaderCell>Detail</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Dari Surat</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.dari_surat | "Belum diisi"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Sampai Surat</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.sampai_surat | "Belum diisi"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Dari Ayat</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.dari_ayat | "Belum diisi"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Sampai Ayat</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.sampai_ayat || "Belum diisi"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Dzikir Pagi</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.dzikir_pagi ? "Sudah" : "Belum"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Dzikir Petang</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.dzikir_petang ? "Sudah" : "Belum"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Sholat Shubuh</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.sholat_shubuh || "Belum diisi"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Sholat Ashar</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.sholat_ashar || "Belum diisi"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Sholat Magrib</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.sholat_magrib || "Belum diisi"}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Sholat Isya</Table.Cell>
                      <Table.Cell>{laporanDiniyyah.sholat_isya || "Belum diisi"}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              ) : (
                <p className="text-xl text-red-500">Belum dikerjakan</p>
              )}
            </div>
          </Segment>

        </div>
      </div>
    </LayoutPage>
  );
};

