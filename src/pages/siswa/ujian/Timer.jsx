import { useEffect, useState } from "react";

export default function Timer({ data, payload, setModalAutoSubmit, submit }) {
  let [waktu, setWaktu] = useState(0);

  useEffect(()=> {
    if (!!data?.data?.waktu_tersisa === true) {
        setWaktu(data?.data?.waktu_tersisa);
      }
  },[data])
  useEffect(() => {
    const interval = setInterval(() => {
      setWaktu((w) => {
        if (!!data?.data?.waktu_tersisa === true) {
          if (w <= 0) {
            setModalAutoSubmit(true); // Tampilkan modal auto submit
            clearInterval(interval); // Hentikan interval untuk mencegah pengurangan waktu lebih lanjut
            setTimeout(() => {
              submit.mutate(payload, {
                onSuccess: () => {
                  window.location.reload();
                },
              });
            }, 3000); // Submit otomatis setelah 5 detik
            return 0;
          }
          return w - 1;
        }
      });
    }, 1000);

    return () => {
      return clearInterval(interval);
    };
  }, [data?.data?.waktu_tersisa, payload, submit]);

  return <span className="text-lg font-semibold">{convertSeconds(waktu)}</span>;
}

function convertSeconds(seconds) {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  if (days < 1) {
    if (hours < 1) {
      return ` ${minutes} menit, ${seconds} detik`;
    } else {
      return `${hours} jam, ${minutes} menit, ${seconds} detik`;
    }
  }

  return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
}
