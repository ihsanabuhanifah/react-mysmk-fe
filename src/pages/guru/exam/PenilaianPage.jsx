import React, { useState } from "react";
import { Button, Form, Icon, Input, Label, Table } from "semantic-ui-react";
import {
  useExamResult,
  usePenilaian,
  useRefreshCount,
  useRemidial,
  useSoal,
} from "../../../api/guru/ujian";
import { TableLoading } from "../../../components";
import LayoutPage from "../../../module/layoutPage";
import { useParams } from "react-router-dom";
import { LabelKeterangan, LabelStatus } from "../../../components/Label";

import { formatWaktu } from "../../../utils/waktu";

import useCheckbox from "../../../hook/useCheckbox";
import Checkbox from "../../../components/Checkbox";

import { TableWrapper } from "../../../components/TableWrap";
import ModalPenilaian from "./ModalPenilaian";
import { FormikProvider, useFormik } from "formik";
import useList from "../../../hook/useList";

function PenilaianPage() {
  const { id, mapel } = useParams();
  let [namaSiswa, setNamaSiswa] = useState({})
  const { isFetching, data, refetch } = usePenilaian({
    ujian_id: id,
  });
  let { roles } = useList();
  const mutateExam = useExamResult();

  const [open, setOpen] = useState(false);
  const [jawaban, setJawaban] = useState([]);
  const [item, setItem] = useState({});

  const { data: dataSoal } = useSoal(id);

  const mutate = useRemidial();
  const refresh = useRefreshCount();
  const { handleCheck, isChecked, payload, setPayload } = useCheckbox();

  const formik = useFormik({
    initialValues: data,

    enableReinitialize: true,
    onSubmit: (values) => {
      const val = values.data.map((item) => {
        if (
          item.is_change === true &&
          item.exam_result !== Number(item.last_result)
        ) {
          return {
            id: item.id,
            exam_result: item.exam_result,
            last_result: item.last_result,
          };
        } else {
          return {};
        }
      });

      const filteredArray = val.filter((item) => Object.keys(item).length > 0);

      mutateExam.mutate(filteredArray);
    },
  });

  const { handleSubmit, setFieldValue, values } = formik;

  return (
    <LayoutPage title={"Penilaian"}>
      {open && (
        <ModalPenilaian
          item={item}
          setItem={setItem}
          open={open}
          setOpen={setOpen}
          soal={dataSoal?.soal}
          jawaban={jawaban}
          values={values}
          namaSiswa={namaSiswa}
        />
      )}
      <section
        style={{
          zoom: "80%",
        }}
        className="grid grid-cols-6 gap-5 mb-5"
      >
        <Button
          content={"Remidial"}
          type="button"
          fluid
          loading={mutate.isLoading}
          disabled={mutate.isLoading || payload.length === 0}
          icon={() => <Icon name="filter" />}
          size="medium"
          color="teal"
          onClick={() => {
            mutate.mutate(payload, {
              onSuccess: () => {
                setPayload([]);
              },
            });
          }}
        />

        <Button
          content={"Izinkan Ujian Kembali"}
          type="button"
          fluid
          loading={refresh.isLoading}
          disabled={refresh.isLoading || payload.length === 0}
          icon={() => <Icon name="filter" />}
          size="medium"
          color="teal"
          onClick={() => {
            refresh.mutate(payload, {
              onSuccess: () => {
                setPayload([]);
              },
            });
          }}
        />

        <Button
          content={"Refresh"}
          type="button"
          fluid
          loading={isFetching}
          disabled={isFetching}
          icon={() => <Icon name="refresh" />}
          size="medium"
          color="blue"
          onClick={() => {
            return refetch();
          }}
        />
      </section>
      <section
        style={{
          zoom: "80%",
        }}
      >
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
            <TableWrapper>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell></Table.HeaderCell>

                    <Table.HeaderCell>No</Table.HeaderCell>
                    <Table.HeaderCell>Nama Siswa</Table.HeaderCell>
                    <Table.HeaderCell>Mata Pelajaran</Table.HeaderCell>

                    <Table.HeaderCell>Jam Mulai</Table.HeaderCell>
                    <Table.HeaderCell>Jam Selesai</Table.HeaderCell>
                    <Table.HeaderCell>Status</Table.HeaderCell>
                    <Table.HeaderCell>Nilai Ujian</Table.HeaderCell>

                    <Table.HeaderCell>Nilai Akhir</Table.HeaderCell>
                    <Table.HeaderCell>Keterangan</Table.HeaderCell>
                    <Table.HeaderCell>Penilaian</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <TableLoading
                    count={12}
                    isLoading={isFetching}
                    data={data?.data}
                    messageEmpty={"Tidak Terdapat Ujian pada id yang dipilih"}
                  >
                    {values?.data?.map((item, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>
                          <Checkbox
                            disabled={
                              item.status === "open" ||
                              (item.status === "progress" &&
                                item.refresh_count > 0)
                            }
                            checked={isChecked(item.id)}
                            onChange={(e) => {
                              handleCheck(e, item.id);
                            }}
                          />
                        </Table.Cell>
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>{item.siswa.nama_siswa}</Table.Cell>
                        <Table.Cell>{mapel}</Table.Cell>

                        <Table.Cell>{formatWaktu(item.jam_mulai)}</Table.Cell>
                        <Table.Cell>{formatWaktu(item.jam_submit)}</Table.Cell>
                        <Table.Cell>
                          <LabelStatus status={item.status} />
                        </Table.Cell>

                        <Table.Cell>
                          {!!item.exam === true
                            ? JSON.parse(item.exam).toString()
                            : "-"}
                        </Table.Cell>

                        <Table.Cell>
                          {
                            <Input
                              className="min-w-[100px]"
                              placeholder="0"
                              onChange={(e) => {
                                let value = Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    Number(e.target.value.replace(",", "."))
                                  )
                                );

                                if (value === 0) {
                                  value = "";
                                }
                                setFieldValue(
                                  `data[${index}]exam_result`,
                                  value
                                );

                                setFieldValue(
                                  `data[${index}]last_result`,
                                  data?.data[index].exam_result
                                );
                                setFieldValue(`data[${index}]is_change`, true);
                              }}
                              value={
                                item.exam_result < 1 ? "" : item.exam_result
                              }
                              type="number"
                            />
                          }
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-xs">
                            {" "}
                            <LabelKeterangan status={item.keterangan || "-"} />
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            color="linkedin"
                            type="button"
                            onClick={() => {

                              
                              setOpen(true);
                              setNamaSiswa({
                                nama_siswa : item.siswa.nama_siswa,
                                mapel : mapel
                              })

                              console.log("item", item);
                              setItem(item);
                              setJawaban(() => {
                                if (!!item.jawaban === false) {
                                  return [];
                                }
                                return JSON.parse(item.jawaban);
                              });
                            }}
                          >
                            {" "}
                            <Icon name="eye" /> Lihat
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </TableLoading>
                </Table.Body>
              </Table>
              <section className="mt-5">
                {values?.data?.[0]?.teacher_id === roles?.teacher_id && (
                  <Button
                    color="teal"
                    fluid
                    loading={mutateExam.isLoading}
                    disabled={mutateExam.isLoading || isFetching}
                    type="submit"
                  >
                    <Icon name="check" /> Perbaharui Nilai
                  </Button>
                )}
              </section>
            </TableWrapper>
          </Form>
        </FormikProvider>
      </section>
    </LayoutPage>
  );
}

export default PenilaianPage;
