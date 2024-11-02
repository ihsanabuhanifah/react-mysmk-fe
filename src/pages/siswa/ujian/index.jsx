import LayoutSiswa from "../../../module/layoutSiswa";
import { myMapel, optionMapel, useExam } from "../../../api/siswa/exam";
import Card from "./Card";
import React, { useEffect, useState } from "react";
import ExamPage from "./ExamPage";
import {
  Input,
  Button,
  Icon,
  Loader,
  Menu,
  Sidebar,
  Select,
} from "semantic-ui-react";
import useToast from "../../../hook/useToast";
import FilterUjian from "./filterUjian";
import { PaginationTable } from "../../../components";
import CardMapel from "./CardMapel";
import { getOptionsText } from "../../../utils/format";
import {} from "react-icons";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

export default function UjianSiswa() {
  const [examActive, setExamActive] = useState(null);
  const { data, setParams, isFetching, dataMapel, params } =
    useExam(examActive);
  const [selectedMapel, setSelectedMapel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Kejuruan");
  const { customToast } = useToast();
  let [visible, setVisible] = React.useState(false);

  const filteredMapel = selectedCategory
    ? myMapel.filter(
        (mapel) =>
          mapel.is.toLocaleLowerCase() === selectedCategory.toLocaleLowerCase(),
      )
    : myMapel;

  const handleCardClick = (mapel) => {
    setSelectedMapel(mapel.nama_mapel);
    setParams((prev) => {
      return {
        ...prev,
        nama_mapel: mapel.nama_mapel,
      };
    });
  };

  return (
    <LayoutSiswa title="Exam">
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        direction="right"
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width="wide"
      >
        <FilterUjian
          params={params}
          setParams={setParams}
          setVisible={setVisible}
          dataMapel={dataMapel}
        />
      </Sidebar>
      {selectedMapel === "" ? (
        <div className="mt-4 w-full px-5">
          <h1 className="mb-6 font-poppins text-2xl font-black capitalize">
            Pilih Mata Pelajaran
          </h1>
          <Select
            className="mb-4"
            options={getOptionsText(optionMapel, "text")}
            label={{
              children: "Kategori Mapel",
            }}
            onChange={(event, data) => {
              setSelectedCategory(data?.value);
            }}
            placeholder="Kategori Mapel"
            value={selectedCategory}
          />
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredMapel.map((_, i) => (
              <CardMapel key={i} _={_} onClick={() => handleCardClick(_)} />
            ))}
          </section>
        </div>
      ) : (
        <>
          <div className="mt-4 w-full px-5">
            <div className="mb-6 flex gap-3">
              <button
                className="cursor-pointer"
                onClick={() => setSelectedMapel("")}
              >
                <IoArrowBack size={20} />
              </button>
              <h1 className="m-0 font-poppins text-2xl font-black capitalize">
                {selectedMapel}
              </h1>
            </div>
            <section className="grid grid-cols-4 gap-4">
              <div className="col-span-4 md:col-span-3">
                <Input
                  fluid
                  loading={false}
                  icon="search"
                  onChange={(e) => {
                    setParams((prev) => {
                      return {
                        ...prev,
                        judul_ujian: e.target.value,
                      };
                    });
                  }}
                  iconPosition="left"
                  placeholder="Search for judul ujian"
                />
              </div>
              <div className="col-span-4 md:col-span-1">
                <Button
                  content={"Filter"}
                  type="button"
                  fluid
                  icon={() => <Icon name="filter" />}
                  size="medium"
                  color="teal"
                  onClick={() => {
                    setVisible(!visible);
                  }}
                />
              </div>
            </section>
          </div>
          <section className="mt-4 grid w-full grid-cols-1 gap-4 px-5 md:grid-cols-2 xl:grid-cols-3">
            {isFetching ? (
              <div className="mt-[30px]">
                <Loader active inline="left" />
              </div>
            ) : examActive ? (
              <ExamPage examActive={examActive} setExamActive={setExamActive} />
            ) : data && data.data.rows.length === 0 ? (
              <div className="col-span-full text-left">
                <p>Tidak ada exam yang tersedia</p>
              </div>
            ) : (
              data.data.rows.map((item, index) => (
                <React.Fragment key={index}>
                  <Card
                    item={item}
                    handleExam={() => {
                      if (item.ujian.is_hirarki) {
                        let newArr = [];
                        data.data.rows.forEach((val) => {
                          if (val.mapel_id === item.mapel_id) {
                            newArr.push(val);
                          }
                        });
                        if (item.ujian.urutan !== 1) {
                          const currentExam = newArr.find(
                            (exam) =>
                              exam.ujian.urutan === item.ujian.urutan - 1,
                          );
                          if (currentExam.status === "finish") {
                            setExamActive(item.id);
                          } else {
                            customToast(
                              "Selesaikan yang sebelumnya terlebih dahulu!",
                            );
                          }
                        } else {
                          setExamActive(item.id);
                        }
                      } else {
                        setExamActive(item.id);
                      }
                    }}
                    setExamActive={setExamActive}
                  />
                </React.Fragment>
              ))
            )}
            {data && data.totalPage >= 1 && (
              <div className="col-span-full">
                <PaginationTable
                  page={params.page}
                  pageSize={params.pageSize}
                  setPageSize={(e) => {
                    setParams((prev) => ({
                      ...prev,
                      pageSize: e,
                    }));
                  }}
                  setPage={(e) => {
                    setParams((prev) => ({
                      ...prev,
                      page: e,
                    }));
                  }}
                  totalPages={data?.totalPage}
                  count={data.data.count}
                />
              </div>
            )}
          </section>
        </>
      )}
    </LayoutSiswa>
  );
}
