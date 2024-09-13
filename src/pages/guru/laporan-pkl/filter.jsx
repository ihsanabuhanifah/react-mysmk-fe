
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
import InputRangeDate from "../../../components/inputDateRange";
import { Formik } from "formik";
import { getOptionsText } from "../../../utils/format";
import { izinOptions } from "../../../utils/options";
import { ReactSelectAsync, FormLabel } from "../../../components";
import { listSiswaOptions } from "../../../api/list";

import useList from "../../../hook/useList";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useState } from "react";

const KehadiranOptions = [
    { key: "1", value: 'hadir', text: "hadir" },
    { key: "2", value: 'izin', text: "izin" },
]

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
    const { dataGuru, dataKelas, dataMapel, dataTa } = useList();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [selectedDate, setSelectedDate] = useState('');

    const onSubmit = (values, { resetForm }) => {
        setFilter(values);
        setVisible(false);
        resetForm();
    };

    const getMonthStartAndEnd = (selectedYear, selectedMonth) => {
        if (!selectedYear || !selectedMonth) return;
        const date = new Date(selectedYear, selectedMonth - 1, 1);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        setDateRange({
            start: format(start, 'yyyy-MM-dd'),
            end: format(end, 'yyyy-MM-dd'),
        });
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
            onSubmit={onSubmit}
        >
            {({ values, setValues, resetForm, handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                    <section className="p-5 bg-gray-50 border shadow-2xl h-screen relative">
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                primary
                                color="blue"
                                content={'Tutup'}
                                onClick={() => {
                                    setVisible(false);
                                }}
                            />
                            <button
                                type="reset"
                                onClick={() => {
                                    resetForm();
                                    setDateRange({ start: '', end: '' });
                                    setValues({
                                        status_kehadiran: '',
                                        nama_siswa: '',
                                        start:'',
                                        end:'',
                                        year: '',
                                        month: ''
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
                                    <Header as="h3">Date Range</Header>
                                    <p>
                                        <strong>Start Date:</strong> {dateRange.start}
                                    </p>
                                    <p>
                                        <strong>End Date:</strong> {dateRange.end}
                                    </p>

                                </Segment>
                            )}
                            {/* {selectedDate && (
                            <Segment style={{ marginTop: '10px' }}>
                                <Header as="h3">Selected Date</Header>
                                <p>
                                    <strong>Date:</strong> {selectedDate}
                                </p>
                            </Segment>
                        )} */}

                            <FormLabel label={"Pilih Bulan"}>
                                <Dropdown
                                    placeholder="Pilih Bulan"
                                    fluid
                                    selection
                                    value={values?.month}
                                    options={monthOptions}
                                    onChange={(e, { value }) => {
                                        setFieldValue('month', value);
                                        
                                        // getMonthStartAndEnd(values.year, value);
                                        handleDateSelection(values.year, value,setFieldValue);
                                    }}
                                />
                            </FormLabel>

                            <FormLabel label={"Pilih Tahun"}>
                                <Dropdown
                                    placeholder="Pilih Tahun"
                                    fluid
                                    selection
                                    value={values?.year}
                                    options={yearOptions}
                                    onChange={(e, { value }) => {
                                        setFieldValue('year', value);
                                        // getMonthStartAndEnd(value, values.month);
                                        handleDateSelection(value, values.month,setFieldValue);
                                        
                                    }}
                                />
                            </FormLabel>
                        </Container>
                        {/* <div className="text-left">
                            <Form.Field
                                control={Input}
                                label={{
                                    children: "Mulai Tanggal",
                                    color: "red",
                                    className: "text-red-500",
                                    size: "medium",
                                }}
                                onChange={(e) => {
                                    setFieldValue("dariTanggal", e.target.value);
                                }}
                                value={values?.dariTanggal}
                                type="date"
                            />
                        </div>
                        {console.log('value filter', values)}
                        <div className="text-left">
                            <Form.Field
                                control={Input}
                                label={{
                                    children: "Sampai Tanggal ",
                                    color: "red",
                                    className: "text-red-500",
                                    size: "medium",
                                }}
                                onChange={(e) => {
                                    setFieldValue("sampaiTanggal", e.target.value);
                                }}
                                value={values?.sampaiTanggal}
                                type="date"
                            />
                        </div> */}

                        <div className="text-left">
                            <FormLabel label={"Nama Siswa"}>
                                <ReactSelectAsync
                                    debounceTimeout={300}
                                    value={values?.nama_siswa}
                                    loadOptions={listSiswaOptions}
                                    isClearable
                                    onChange={(data) => {
                                        setFieldValue(`nama_siswa`, data);
                                    }}
                                    placeholder="Nama Siswa"
                                    additional={{
                                        page: 1,
                                    }}
                                />
                            </FormLabel>
                        </div>

                        <div className="text-left">
                            <Form.Field
                                control={Select}
                                options={KehadiranOptions}
                                label={{
                                    children: "Status Kehadiran",
                                }}
                                onChange={(event, data) => {
                                    setFieldValue(`status_kehadiran`, data?.value);
                                }}
                                fluid
                                value={values?.status_kehadiran}
                                placeholder="Status Kehadiran"
                                search
                                clearable
                            />
                        </div>

                        <div className="absolute bottom-2 xl:bottom-12 right-2 left-2">
                            <Button
                                icon={() => <Icon name="filter" />}
                                type="submit"
                                content="Terapkan"
                                fluid
                                color="teal"
                            />
                        </div>
                    </section>
                </Form>
            )}
        </Formik>
    );
}
