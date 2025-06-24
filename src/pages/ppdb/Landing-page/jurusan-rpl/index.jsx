import { Link } from "react-router-dom";
import NavPpdb from "../../../../components/NavPpdb";
import Banner from "../../../../image/ppdb/banner.png";
const JurusanRpl = () => {
  return (
    <>
      <NavPpdb />
      <main>
        {/* Bagian Banner */}
        <div className="p-4 bg-imageBackground bg-cover bg-center h-screen w-full flex items-center justify-between px-8">
          <div className="flex flex-col justify-start mr-8">
            <p className="text-white text-5xl text-start leading-tight mb-6">
              Jurusan
              <br />
              Rekayasa Perangkat Lunak
              <br />
              2025-2026
            </p>
          </div>
          <div>
            <img
              src={Banner}
              alt="Banner"
              style={{ minHeight: "60%", minWidth: "60%" }}
            />
          </div>
        </div>
        {/* Akhir Banner */}
      </main>
    </>
  );
};

export default JurusanRpl;
