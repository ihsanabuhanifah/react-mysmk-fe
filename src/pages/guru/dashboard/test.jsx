import React from "react";
import LayoutPage from "../../../module/layoutPage";
import { useNavigate, useParams } from "react-router-dom";
import { Tab } from "semantic-ui-react";
import { render } from "@testing-library/react";
import TestContent from "./apa";
import TestContent2 from "./apa2";

const NilaiContent = () => <div>Konten Nilai</div>;
const UjianContent = () => <div>Konten Ujian</div>;
const PelanggaranContent = () => <div>Konten Pelanggaran</div>;

export default function TestFatih() {
    const [visible, setVisible] = React.useState(false);
    const navigate = useNavigate();
    const { nama } = useParams();
    const panes = [
        {
            menuItem: 'Update Siswa',
            render: () => (
                <Tab.Pane style={{ border: 'none', boxShadow: 'none' }} >
                    <TestContent></TestContent>
                </Tab.Pane>
            )
        },
        {
            menuItem: 'Update Siswa',
            render: () => (
                <Tab.Pane style={{ border: 'none', boxShadow: 'none' }} >
                    <TestContent2></TestContent2>
                </Tab.Pane>
            )
        },

    ]

    return (
        <LayoutPage title={"Update Siswa"} visible={visible} setVisible={setVisible} >
            <section className="grid gap-5">
                <div className="col-span-6 lg:col-span-1 xl:col-span-1 ">
                    <Tab menu={{ secondary: true, pointing: true }} panes={panes} >

                    </Tab>
                </div>
            </section>

        </LayoutPage>
    )
}

