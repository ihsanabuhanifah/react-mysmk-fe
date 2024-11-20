import LayoutPpdb from "../../../module/layoutPpdb";
import Card from "./card";
import { FaSearch } from "react-icons/fa"; // Importing the search icon
import { useState } from "react";
import { useExamCalonSantri } from "../../../api/ppdb/examCalonSantri";

const Ujian = () => {
  const [filter, setFilter] = useState(""); // State for the filter input

  // Fetch data using useExamCalonSantri hook
  const { data: mapelData, isLoading, isFetching, params, setParams } = useExamCalonSantri();

  // Filtered data based on the input
  const filteredMapelData = mapelData?.data?.filter((item) =>
    item.nama_mapel.toLowerCase().includes(filter.toLowerCase())
  );

  if (isLoading || isFetching) return <p>Loading...</p>;

  return (
    <LayoutPpdb title="Tes Penerimaan Calon Santri">
      {/* Enhanced Filter Input with React Icons */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Cari Mata Pelajaran..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredMapelData?.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </LayoutPpdb>
  );
};

export default Ujian;
