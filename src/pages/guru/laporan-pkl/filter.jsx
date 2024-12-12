
import {
    Input,
    Select,
    Form,
    Button,
    Icon,
    Header,
    Dropdown,
    Container,
    Segment
} from "semantic-ui-react";
import { Formik } from "formik";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { listSiswaOptions } from "../../../api/list";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDownloadPdf } from "../../../api/guru/laporanharianpkl";
import { startOfMonth, endOfMonth, format } from "date-fns";
import html2pdf from "html2pdf.js";


// Pilihan untuk dropdown bulan
const monthOptions = [
    { key: 'jan', value: 1, text: 'Januari' },
    { key: 'feb', value: 2, text: 'Februari' },
    { key: 'mar', value: 3, text: 'Maret' },
    { key: 'apr', value: 4, text: 'April' },
    { key: 'may', value: 5, text: 'Mei' },
    { key: 'jun', value: 6, text: 'Juni' },
    { key: 'jul', value: 7, text: 'Juli' },
    { key: 'aug', value: 8, text: 'Agustus' },
    { key: 'sep', value: 9, text: 'September' },
    { key: 'oct', value: 10, text: 'Oktober' },
    { key: 'nov', value: 11, text: 'November' },
    { key: 'dec', value: 12, text: 'Desember' },
];

// Pilihan untuk dropdown tahun
const yearOptions = [
    { key: '2023', value: 2023, text: '2023' },
    { key: '2024', value: 2024, text: '2024' },
    { key: '2025', value: 2025, text: '2025' },
];

export default function FilterLaporanPkl({ filter, setFilter, setVisible }) {
    const contentRef = useRef();


    // const handleDownload = () => {
    //     const element = targetRef.current;

    //     const options = {
    //         margin: 1,
    //         filename: 'ComponentA.pdf',
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    //     };

    //     html2pdf().set(options).from(element).save();
    // };

    // useEffect(() => {
    //     // Ensure the code only runs on the client-side
    //     if (typeof window !== "undefined") {
    //         require("html2pdf.js");
    //     }
    // }, []);
    const { id } = useParams();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [studentId, setStudentId] = useState(null);
    const { mutate: downloadPdfIsMutate, isLoading: downloadPdfIsLoading, params: downloadParams, setParams, filterParams } = useDownloadPdf();

    // const handleDownloadPdf = useCallback((values) => {
    //     const { bulan, tahun } = values;
    //     if (!studentId) {
    //         console.log('ID siswa belum dipilih');
    //         return;  
    //     }
    //     if (studentId && bulan && tahun) {
    //         const url = `/guru/laporan-harian-pkl/download-pdf/${studentId}`;
    //         const params = { bulan, tahun };
    //         downloadPdfIsMutate({ url, params });
    //         console.log('URL:', url, 'Params:', params);
    //     } else {
    //         console.log('ID siswa, bulan, atau tahun belum dipilih');
    //     }
    // }, [studentId, downloadPdfIsMutate]);

    const handleSubmit = (value, { resetForm }) => {
        // setFilter(values);
        setFilter(value);
        // setStudentId(value?.nama_siswa?.value);
        setVisible(false);
        console.log('Form Values:', value);
    };


    const handleDateSelection = (selectedYear, selectedMonth, setFieldValue) => {
        if (!selectedYear || !selectedMonth) return;

        const start = startOfMonth(new Date(selectedYear, selectedMonth - 1));
        const end = endOfMonth(start);

        setDateRange({
            start: format(start, 'yyyy-MM-dd'),
            end: format(end, 'yyyy-MM-dd'),
        });

        // Update Formik values with the calculated dates
        setFieldValue('dariTanggal', format(start, 'yyyy-MM-dd'));
        setFieldValue('sampaiTanggal', format(end, 'yyyy-MM-dd'));
    };

    return (
        <Formik
            initialValues={filter}
            enableReinitialize
            onSubmit={handleSubmit}
        >
            {({ values, setValues, resetForm, handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                    <section className="p-5 bg-gray-50 border shadow-2xl h-screen relative">
                        <div className="flex items-center justify-between">
                            <Button
                                primary
                                color="blue"
                                content={'Tutup'}
                                onClick={() => setVisible(false)}
                            />
                            <button
                                type="reset"
                                onClick={() => {
                                    resetForm();
                                    setDateRange({ start: '', end: '' });
                                    setValues({
                                        status_kehadiran: '',
                                        nama_siswa: '',
                                        bulan: '',
                                        tahun: ''
                                    });
                                }}
                                className="text-lg text-red-500 font-bold"
                            >
                                Reset
                            </button>
                        </div>

                        <Container className="text-left ">
                            {/* <div>
                                <h1>HTML to PDF in Next.js</h1>
                                <div ref={contentRef} style={{ padding: '20px', border: '1px solid #000' }}>
                                    <h2>This is the content of the PDF</h2>
                                    <p>You can style this content as needed.</p>
                                </div>
                            </div> */}
                            {dateRange.start && dateRange.end && (
                                <Segment style={{ marginTop: '10px' }}>
                                    <Header as="h3">Tanggal Dipilih</Header>
                                    <p><strong>Mulai:</strong> {dateRange.start}</p>
                                    <p><strong>Selesai:</strong> {dateRange.end}</p>
                                </Segment>
                            )}

                            {/* <FormLabel label={"Pilih Bulan"}>
                                <Dropdown
                                    placeholder="Pilih Bulan"
                                    fluid
                                    selection
                                    value={values?.bulan}
                                    options={monthOptions}
                                    onChange={(e, {value}) => {
                                        // setFieldValue('bulan', value);
                                        
                                        // console.log('data value', data.value);
                                        setFieldValue('bulan', value);
                                        setParams((params) => ({
                                            ...params,
                                            bulan: value,

                                        }))
                                            // handleDateSelection(data.tahun, data, setFieldValue);
                                        // console.log('params', params.bulan)
                                    }}
                                />
                            </FormLabel> */}
                            <FormLabel label={"Dari Tanggal"}>
                                <Input
                                className="w-full"
                                    type="date"
                                    placeholder="Dari Tanggal"
                                    value={values?.dariTanggal}
                                    onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        const selectedYear = selectedDate.getFullYear();
                                        const selectedMonth = selectedDate.getMonth() + 1;

                                        setFieldValue('dariTanggal', e.target.value);
                                        handleDateSelection(selectedYear, selectedMonth, setFieldValue);

                                        setParams((params) => ({
                                            ...params,
                                            dariTanggal: e.target.value,
                                        }));
                                    }}
                                />
                            </FormLabel>

                            <FormLabel label={"Sampai Tanggal"}>
                                <Input
                                className="w-full"
                                    type="date"
                                    placeholder="Sampai Tanggal"
                                    value={values?.sampaiTanggal}
                                    onChange={(e) => {
                                        setFieldValue('sampaiTanggal', e.target.value);

                                        setParams((params) => ({
                                            ...params,
                                            sampaiTanggal: e.target.value,
                                        }));
                                    }}
                                />
                            </FormLabel>


                            <FormLabel label={"Pilih Tahun"}>
                                <Dropdown
                                    placeholder="Pilih Tahun"
                                    fluid
                                    selection
                                    value={values?.tahun}
                                    options={yearOptions}
                                    // onChange={(e, { value }) => {
                                    //     setFieldValue('tahun', value);
                                    //     handleDateSelection(value, values.bulan, setFieldValue);

                                    // }}
                                    onChange={(e, { value }) => {
                                        // setFieldValue('bulan', value);
                                        console.log('data', value);
                                        setFieldValue('tahun', value);
                                        setParams((params) => ({
                                            ...params,
                                            tahun: value,

                                        }))
                                        // handleDateSelection(data.bulan, data, setFieldValue);
                                        // console.log('params', params.tahun)
                                    }}
                                />
                            </FormLabel>

                            <FormLabel label={"Nama Siswa"}>
                                <ReactSelectAsync
                                    debounceTimeout={300}
                                    value={values.nama_siswa?.label}
                                    loadOptions={listSiswaOptions}
                                    isClearable
                                    onChange={(data) => {


                                        // setFieldValue(`studentId`, data.value);
                                        setFieldValue(`nama_siswa`, data?.label);
                                        console.log(data)
                                        // setFieldValue(`nama_siswa`, data);
                                        // setStudentId(data?.value);
                                        setParams((params) => ({
                                            ...params,
                                            studentId: data?.value,
                                            // nama_siswa:data.label

                                        }))
                                    }}
                                    placeholder="Nama Siswa"
                                />
                            </FormLabel>

                            <Form.Field
                                control={Select}
                                options={[
                                    { key: "1", value: 'hadir', text: "Hadir" },
                                    { key: "2", value: 'izin', text: "Izin" }
                                ]}
                                label="Status Kehadiran"
                                onChange={(e, { value }) => setFieldValue('status_kehadiran', value)}
                                value={values?.status_kehadiran}
                                fluid
                                clearable
                            />

                            <div className="absolute bottom-2 right-2 left-2">
                                <Button type="submit" content="Terapkan" fluid color="teal" />
                                <br />
                                {/* <Button
                                    fluid
                                    color="red"
                                    
                                    // onClick={() => handleDownloadPdf(values)}
                                    onClick={() => {
                                        // Validasi bahwa bulan, tahun, dan student_id sudah terisi sebelum memanggil mutate
                                        // if (!values.student_id || !values.bulan || !values.tahun) {
                                        //     console.error("Parameter belum lengkap.");
                                        //     return;
                                        // }
                                        // console.log(values.student_id)
                                        
                                        // Mutate dipanggil hanya ketika semua parameter sudah lengkap
                                        console.log('a');
                                        downloadPdfIsMutate();
                                        
                                    }}
                                    disabled={downloadPdfIsLoading || !values.studentId || !values.bulan || !values.tahun}
                                >

                                    {downloadPdfIsLoading ? 'Loading' : (
                                        <>
                                            <Icon name="download" /> Download PDF
                                        </>
                                    )}
                                </Button> */}
                            </div>
                        </Container>
                    </section>
                </Form>
            )}
        </Formik>
    );
}


// import {
//     Input,
//     Select,
//     Form,
//     Button,
//     Icon,
//     Header,
//     Dropdown,
//     Container,
//     Segment
// } from "semantic-ui-react";
// import { Formik } from "formik";
// import { ReactSelectAsync, FormLabel } from "../../../components";
// import { listSiswaOptions } from "../../../api/list";
// import debounce from "lodash.debounce";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDownloadPdf } from "../../../api/guru/laporanharianpkl";
// import { startOfMonth, endOfMonth, format } from "date-fns";
// import html2pdf from "html2pdf.js";


// // Pilihan untuk dropdown bulan
// const monthOptions = [
//     { key: 'jan', value: 1, text: 'Januari' },
//     { key: 'feb', value: 2, text: 'Februari' },
//     { key: 'mar', value: 3, text: 'Maret' },
//     { key: 'apr', value: 4, text: 'April' },
//     { key: 'may', value: 5, text: 'Mei' },
//     { key: 'jun', value: 6, text: 'Juni' },
//     { key: 'jul', value: 7, text: 'Juli' },
//     { key: 'aug', value: 8, text: 'Agustus' },
//     { key: 'sep', value: 9, text: 'September' },
//     { key: 'oct', value: 10, text: 'Oktober' },
//     { key: 'nov', value: 11, text: 'November' },
//     { key: 'dec', value: 12, text: 'Desember' },
// ];

// // Pilihan untuk dropdown tahun
// const yearOptions = [
//     { key: '2023', value: 2023, text: '2023' },
//     { key: '2024', value: 2024, text: '2024' },
//     { key: '2025', value: 2025, text: '2025' },
// ];

// export default function FilterLaporanPkl({ filter, setFilter, setVisible, targetRef }) {
//     const contentRef = useRef();

//     // const generatePdf = () => {
//     //     const element = contentRef.current;
//     //     html2pdf().from(element).save();
//     // };
//     const handleDownload = () => {
//         const element = targetRef.current;

//         const options = {
//             margin: 1,
//             filename: 'ComponentA.pdf',
//             image: { type: 'jpeg', quality: 0.98 },
//             html2canvas: { scale: 2 },
//             jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
//         };

//         html2pdf().set(options).from(element).save();
//     };

//     useEffect(() => {
//         // Ensure the code only runs on the client-side
//         if (typeof window !== "undefined") {
//             require("html2pdf.js");
//         }
//     }, []);
//     const { id } = useParams();
//     const [dateRange, setDateRange] = useState({ start: '', end: '' });
//     const [studentId, setStudentId] = useState(null);
//     const { mutate: downloadPdfIsMutate, isLoading: downloadPdfIsLoading } = useDownloadPdf();


//     const handleSubmit = (values) => {
//         setFilter(values);
//         setStudentId(values?.nama_siswa?.value);
//         console.log('Form Values:', values);
//         const params = {
//             bulan: values.bulan,
//             tahun: values.tahun,
//             student_id: values.nama_siswa?.value
//         }
//         downloadPdfIsMutate(params)
//         setVisible(false);
//     };

//     const handleDateSelection = (selectedYear, selectedMonth, setFieldValue) => {
//         if (!selectedYear || !selectedMonth) return;

//         const start = startOfMonth(new Date(selectedYear, selectedMonth - 1));
//         const end = endOfMonth(start);

//         setDateRange({
//             start: format(start, 'yyyy-MM-dd'),
//             end: format(end, 'yyyy-MM-dd'),
//         });

//         // Update Formik values with the calculated dates
//         setFieldValue('dariTanggal', format(start, 'yyyy-MM-dd'));
//         setFieldValue('sampaiTanggal', format(end, 'yyyy-MM-dd'));
//     };

//     return (
//         <Formik
//             initialValues={filter}
//             enableReinitialize
//             onSubmit={handleSubmit}
//         >
//             {({ values, setValues, resetForm, handleSubmit, setFieldValue }) => (
//                 <Form onSubmit={handleSubmit}>
//                     <section className="p-5 bg-gray-50 border shadow-2xl h-screen relative">
//                         <div className="flex items-center justify-between">
//                             <Button
//                                 primary
//                                 color="blue"
//                                 content={'Tutup'}
//                                 onClick={() => setVisible(false)}
//                             />
//                             <button
//                                 type="reset"
//                                 onClick={() => {
//                                     resetForm();
//                                     setDateRange({ start: '', end: '' });
//                                     setValues({
//                                         status_kehadiran: '',
//                                         nama_siswa: '',
//                                         bulan: '',
//                                         tahun: ''
//                                     });
//                                 }}
//                                 className="text-lg text-red-500 font-bold"
//                             >
//                                 Reset
//                             </button>
//                         </div>

//                         <Container className="text-left">
//                             {/* <div>
//                                 <h1>HTML to PDF in Next.js</h1>
//                                 <div ref={contentRef} style={{ padding: '20px', border: '1px solid #000' }}>
//                                     <h2>This is the content of the PDF</h2>
//                                     <p>You can style this content as needed.</p>
//                                 </div>
//                             </div> */}
//                             {dateRange.start && dateRange.end && (
//                                 <Segment style={{ marginTop: '10px' }}>
//                                     <Header as="h3">Tanggal Dipilih</Header>
//                                     <p><strong>Mulai:</strong> {dateRange.start}</p>
//                                     <p><strong>Selesai:</strong> {dateRange.end}</p>
//                                 </Segment>
//                             )}

//                             <FormLabel label={"Pilih Bulan"}>
//                                 <Dropdown
//                                     placeholder="Pilih Bulan"
//                                     fluid
//                                     selection
//                                     value={values?.bulan}
//                                     options={monthOptions}
//                                     onChange={(e, { value }) => {
//                                         setFieldValue('bulan', value);
//                                         handleDateSelection(values.tahun, value, setFieldValue);
//                                         setParams((prev) => ({
//                                             ...prev,
//                                             bulan: data.value,


//                                         }
//                                         ))
//                                     }}
//                                 />
//                             </FormLabel>

//                             <FormLabel label={"Pilih Tahun"}>
//                                 <Dropdown
//                                     placeholder="Pilih Tahun"
//                                     fluid
//                                     selection
//                                     value={values?.tahun}
//                                     options={yearOptions}
//                                     onChange={(e, { value }) => {
//                                         setFieldValue('tahun', value);
//                                         handleDateSelection(value, values.bulan, setFieldValue);
//                                     }}
//                                 />
//                             </FormLabel>

//                             <FormLabel label={"Nama Siswa"}>
//                                 <ReactSelectAsync
//                                     debounceTimeout={300}
//                                     value={values?.nama_siswa}
//                                     loadOptions={listSiswaOptions}
//                                     isClearable
//                                     onChange={(data) => {
//                                         setFieldValue(`nama_siswa`, data);
//                                         setStudentId(data?.value);
//                                     }}
//                                     placeholder="Nama Siswa"
//                                 />
//                             </FormLabel>

//                             <Form.Field
//                                 control={Select}
//                                 options={[
//                                     { key: "1", value: 'hadir', text: "Hadir" },
//                                     { key: "2", value: 'izin', text: "Izin" }
//                                 ]}
//                                 label="Status Kehadiran"
//                                 onChange={(e, { value }) => setFieldValue('status_kehadiran', value)}
//                                 value={values?.status_kehadiran}
//                                 fluid
//                                 clearable
//                             />

//                             <div className="absolute bottom-2 right-2 left-2">
//                                 <Button type="submit" content="Terapkan" fluid color="teal" />
//                                 <br />
//                                 <Button
//                                     fluid
//                                     color="red"
//                                     // onClick={() => handleDownloadPdf(values)}
//                                     // onClick={handleDownload}
//                                     disabled={downloadPdfIsLoading || !studentId}


//                                 // disabled={downloadPdfIsLoading || !studentId || !values.bulan || !values.tahun}
//                                 >

//                                     {downloadPdfIsLoading ? 'Loading' : (
//                                         <>
//                                             <Icon name="download" /> Download PDF
//                                         </>
//                                     )}
//                                 </Button>
//                             </div>
//                         </Container>
//                     </section>
//                 </Form>
//             )}
//         </Formik>
//     );
// }
