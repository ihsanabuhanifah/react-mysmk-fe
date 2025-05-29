import React from 'react';
import { Label } from 'semantic-ui-react';

const ActivityCard = ({ judul_kegiatan, foto, tanggal, status, student_id }) => {
  const statusColor = {
    'Selesai': 'green',
    'Proses': 'yellow',
    'Tertunda': 'red',
  }[status] || 'grey';

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
      <img className="w-full h-48 object-cover" src={foto} alt={judul_kegiatan} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{judul_kegiatan}</div>
        <p className="text-gray-700 text-base">
          Tanggal: {tanggal}
        </p>
        <p className="text-gray-700 text-base">
          Student ID: {student_id}
        </p>
        <Label color={statusColor}>{status}</Label>
      </div>
    </div>
  );
};

export default ActivityCard;
