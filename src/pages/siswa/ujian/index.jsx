import LayoutSiswa from "../../../module/layoutSiswa";
import { useExam } from "../../../api/siswa/exam";
import Card from "./Card";
import React, { useState } from "react";
import ExamPage from "./ExamPage";
import {
  Input,
  Button,
  Icon,
  Loader,
  Menu,
  Sidebar,
  Pagination,
  Dropdown,
  Grid,
} from "semantic-ui-react";
import useToast from "../../../hook/useToast";
import FilterUjian from "./filterUjian";

export default function UjianSiswa() {
  const [examActive, setExamActive] = useState(null);

  const {
    data,
    isFetching,
    dataMapel,
    refetch,
    setParams,
    params,
    handlePageChange,
    handlePageSizeChange,
  } = useExam(examActive);
  const { customToast } = useToast();
  const [visible, setVisible] = React.useState(false);

  const pageSizeOptions = [
    { key: "6", value: 6, text: "6 per halaman" },
    { key: "12", value: 12, text: "12 per halaman" },
    { key: "24", value: 24, text: "24 per halaman" },
    { key: "48", value: 48, text: "48 per halaman" },
  ];

  return (
    <LayoutSiswa title="Ujian">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filter and Search Section */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Grid stackable>
            <Grid.Row columns={3}>
              <Grid.Column width={10}>
                <Input
                  fluid
                  loading={isFetching}
                  icon="search"
                  onChange={(e) => {
                    setParams((prev) => ({
                      ...prev,
                      judul_ujian: e.target.value,
                      page: 1,
                    }));
                  }}
                  value={params.judul_ujian}
                  iconPosition="left"
                  placeholder="Cari judul ujian..."
                />
              </Grid.Column>
              <Grid.Column width={3}>
                <Button
                  fluid
                  icon="filter"
                  content="Filter"
                  color="teal"
                  onClick={() => setVisible(!visible)}
                />
              </Grid.Column>
              <Grid.Column width={3}>
                <Button
                  fluid
                  icon="refresh"
                  content="Refresh"
                  color="blue"
                  onClick={refetch}
                  loading={isFetching}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

        {/* Filter Sidebar */}
        <Sidebar
          as={Menu}
          animation="overlay"
          direction="right"
          onHide={() => setVisible(false)}
          vertical
          visible={visible}
          width="wide"
          className="!w-80"
        >
          <FilterUjian
            params={params}
            setParams={setParams}
            setVisible={setVisible}
            dataMapel={dataMapel}
          />
        </Sidebar>

        {/* Main Content */}
        {examActive ? (
          <ExamPage examActive={examActive} setExamActive={setExamActive} />
        ) : (
          <>
            {/* Exam Cards Grid */}
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isFetching ? (
                <div className="col-span-full flex justify-center py-10">
                  <Loader active inline="centered" size="large" />
                </div>
              ) : data?.data.rows.length === 0 ? (
                <div className="col-span-full rounded-lg bg-white py-10 text-center shadow-sm">
                  <Icon
                    name="file outline"
                    size="huge"
                    className="!text-gray-400"
                  />
                  <p className="mt-4 text-lg font-medium text-gray-600">
                    Tidak ada ujian yang tersedia
                  </p>
                </div>
              ) : (
                data?.data.rows.map((item, index) => (
                  <Card
                    key={index}
                    item={item}
                    handleExam={() => {
                      if (item.ujian.is_hirarki) {
                        const newArr = data.data.rows.filter(
                          (val) => val.mapel_id === item.mapel_id,
                        );
                        if (item.ujian.urutan !== 1) {
                          const prevExam = newArr.find(
                            (exam) =>
                              exam.ujian.urutan === item.ujian.urutan - 1,
                          );
                          if (prevExam?.status === "finish") {
                            setExamActive(item.id);
                          } else {
                            customToast(
                              "Selesaikan ujian sebelumnya terlebih dahulu!",
                            );
                          }
                        } else {
                          setExamActive(item.id);
                        }
                      } else {
                        setExamActive(item.id);
                      }
                    }}
                  />
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {data?.data.rows.length > 0 && (
              <div className="flex flex-col items-center justify-between rounded-lg bg-white p-4 shadow-sm sm:flex-row">
                <div className="mb-4 flex items-center sm:mb-0">
                  <span className="mr-2 text-sm text-gray-600">
                    Items per page:
                  </span>
                  <Dropdown
                    selection
                    options={pageSizeOptions}
                    value={params.pageSize}
                    onChange={handlePageSizeChange}
                    className="!min-h-[36px]"
                  />
                </div>

                <Pagination
                  activePage={params.page}
                  totalPages={Math.ceil(data?.data.count / params.pageSize)}
                  onPageChange={handlePageChange}
                  firstItem={null}
                  lastItem={null}
                  prevItem={{ content: <Icon name="angle left" />, icon: true }}
                  nextItem={{
                    content: <Icon name="angle right" />,
                    icon: true,
                  }}
                  boundaryRange={1}
                  siblingRange={1}
                />

                <div className="mt-4 text-sm text-gray-600 sm:mt-0">
                  Menampilkan {(params.page - 1) * params.pageSize + 1} -{" "}
                  {Math.min(params.page * params.pageSize, data?.data.count)}{" "}
                  dari {data?.data.count} ujian
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </LayoutSiswa>
  );
}
