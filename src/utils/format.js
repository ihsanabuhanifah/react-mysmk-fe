const getOptions = (array, text) => {
  const options = [];

  console.log("sss", array);

  array?.map((data, index) => {
    let option = {
      key: index,
      value: data.id,
      text: data[`${text}`],
    };
    options.push(option);
  });

  return options;
};

function statusApproval(value) {
  if (value === "disetujui") {
    return (
      <div className="bg-green-300 text-gray-100 font-bold rounded-sm px-2 py-1 text-center">
        Disetujui
      </div>
    );
  }
  if (value === "ditolak") {
    return (
      <div className="bg-red-300 text-gray-100 font-bold rounded-sm px-2 py-1 text-center">
        Di Tolak
      </div>
    );
  }
  if (value === "menunggu") {
    return (
      <div className="bg-yellow-300 text-gray-100 font-bold rounded-sm px-2 py-1 text-center">
        Menunggu
      </div>
    );
  }
}

function formatWaktuSholat(value) {
  if (value === 1) {
    return "Subuh";
  }
  if (value === 2) {
    return "Dzuhur";
  }
  if (value === 3) {
    return "Ashar";
  }
  if (value === 4) {
    return "Maghrib";
  }
  if (value === 5) {
    return "Isya";
  }
  if (value === 6) {
    return "Tahajud";
  }
  if (value === 7) {
    return "Dhuha";
  }
}

function formatAlasanTidakShoalt(value) {
  if (value === 1) {
    return "Tidak Berjamaah di Mesjid";
  }
  if (value === 2) {
    return "Masbuk";
  }
}

export {
  getOptions,
  statusApproval,
  formatAlasanTidakShoalt,
  formatWaktuSholat,
};
