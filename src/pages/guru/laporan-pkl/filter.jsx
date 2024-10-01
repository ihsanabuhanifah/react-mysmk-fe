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
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useDownloadPdf } from "../../../api/guru/laporanharianpkl";
import { startOfMonth, endOfMonth, format } from "date-fns";

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
    const { id } = useParams();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [studentId, setStudentId] = useState(null);
    const { mutate: downloadPdfIsMutate, isLoading: downloadPdfIsLoading } = useDownloadPdf(id);

    const handleDownloadPdf = useCallback((values) => {
        const { bulan, tahun } = values;
        if (!studentId) {
        console.log('ID siswa belum dipilih');
        return;
    }
        if (studentId && bulan && tahun) {
            const url = `/guru/laporan-harian-pkl/download-pdf/${studentId}`;
            const params = { bulan, tahun };
            downloadPdfIsMutate({ url, params });
            console.log('URL:', url, 'Params:', params);
        } else {
            console.log('ID siswa, bulan, atau tahun belum dipilih');
        }
    }, [studentId, downloadPdfIsMutate]);
    // console.log('handlepdf',handleDownloadPdf)

    const handleSubmit = (values, { resetForm }) => {
        setFilter(values);
        setStudentId(values?.nama_siswa?.value);
        setVisible(false);
        console.log('Form Values:', values);
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

                        <Container className="text-left">
                            {dateRange.start && dateRange.end && (
                                <Segment style={{ marginTop: '10px' }}>
                                    <Header as="h3">Tanggal Dipilih</Header>
                                    <p><strong>Mulai:</strong> {dateRange.start}</p>
                                    <p><strong>Selesai:</strong> {dateRange.end}</p>
                                </Segment>
                            )}

                            <FormLabel label={"Pilih Bulan"}>
                                <Dropdown
                                    placeholder="Pilih Bulan"
                                    fluid
                                    selection
                                    value={values?.bulan}
                                    options={monthOptions}
                                    onChange={(e, { value }) => {
                                        setFieldValue('bulan', value);
                                        handleDateSelection(values.tahun, value, setFieldValue);
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
                                    onChange={(e, { value }) => {
                                        setFieldValue('tahun', value);
                                        handleDateSelection(value, values.bulan, setFieldValue);
                                    }}
                                />
                            </FormLabel>

                            <FormLabel label={"Nama Siswa"}>
                                <ReactSelectAsync
                                    debounceTimeout={300}
                                    value={values?.nama_siswa}
                                    loadOptions={listSiswaOptions}
                                    isClearable
                                    onChange={(data) => {
                                        setFieldValue(`nama_siswa`, data);
                                        setStudentId(data?.value);
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
                                <Button
                                    fluid
                                    color="red"
                                    onClick={() => handleDownloadPdf(values)}
                                    
                                    disabled={downloadPdfIsLoading || !studentId || !values.bulan || !values.tahun}
                                >
                                    
                                    {downloadPdfIsLoading ? 'Loading' : (
                                        <>
                                            <Icon name="download" /> Download PDF
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Container>
                    </section>
                </Form>
            )}
        </Formik>
    );
}
