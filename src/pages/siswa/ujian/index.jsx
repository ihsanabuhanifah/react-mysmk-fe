import { useSelector } from "react-redux";
import LayoutSiswa from "../../../module/layoutSiswa";
import { useExam } from "../../../api/siswa/exam";
import Card from "./Card";
import React, { useEffect, useState } from "react";
import ExamPage from "./ExamPage";
import {
  Input,
  Button,
  Dropdown,
  Icon,
  Loader,
  Menu,
  Sidebar,
} from "semantic-ui-react";
import { LoadingPage } from "../../../components";
import useToast from "../../../hook/useToast";
import FilterUjian from "./filterUjian";

export default function UjianSiswa() {
  const [examActive, setExamActive] = useState(null);
  const { data, setParams, isFetching, dataMapel, params, loadMapel } =
    useExam(examActive);
  const { customToast } = useToast();
  let [visible, setVisible] = React.useState(false);

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
      <div className="px-5 mt-4 w-full">
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
      <section className="mt-4 grid h-screen w-full grid-cols-1 gap-4 overflow-y-auto px-5 pb-[280px] md:grid-cols-2 xl:grid-cols-3 xl:pb-[180px]">
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
                        (exam) => exam.ujian.urutan === item.ujian.urutan - 1,
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
      </section>
    </LayoutSiswa>
  );
}

// [
//   {urutan: 1, status: 'finish'},
//   {urutan: 2, status: 'open'},
//   {urutan: 3, status: 'open'},
// ]
