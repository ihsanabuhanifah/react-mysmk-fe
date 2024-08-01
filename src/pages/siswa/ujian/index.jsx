import { useSelector } from "react-redux";
import LayoutSiswa from "../../../module/layoutSiswa";
import { useExam } from "../../../api/siswa/exam";
import Card from "./Card";
import React, { useState } from "react";
import ExamPage from "./ExamPage";

export default function UjianSiswa() {
  const [examActive, setExamActive] = useState(null);
  const { data } = useExam(examActive);

  return (
    <LayoutSiswa title="Exam">
      {JSON.stringify(examActive)}
      <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {examActive ? (
          <ExamPage examActive={examActive} setExamActive={setExamActive} />
        ) : (
          <>
            {data &&
              data.data.rows.map((item, index) => (
               <React.Fragment key={index}>
                 <Card
                 
                 item={item}
                 handleExam={() => {
                   console.log("jalan");
                   setExamActive(item.id);
                 }}
                 setExamActive={setExamActive}
               />
               </React.Fragment>
              ))}
          </>
        )}
        {}
      </section>
    </LayoutSiswa>
  );
}
