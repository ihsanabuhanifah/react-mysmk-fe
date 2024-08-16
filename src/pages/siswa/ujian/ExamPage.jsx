import React, { useEffect, useState } from 'react'
import { useProgressExam, useSubmitExam, useTakeExam } from '../../../api/siswa/exam'

import Pg from './Pg'
import TF from './TF'
import ES from './ES'
import clsx from 'clsx'
import { Button, Icon, Dimmer, Loader, Modal } from 'semantic-ui-react'
import ModalKonfirmasi from '../../../components/ModalKonfrimasi'

export default function ExamPage({ examActive, setExamActive }) {
	React.useEffect(() => {
		document.title = 'MySMK - Exam'
	})

	let [soal, setSoal] = useState([])
	let [cutDown, setCutDown] = useState(10) // Set initial countdown to 10
	let [open, setOpen] = useState(false)
	let [mouse, setMouse] = useState(false)
  let [modalAutoSubmit, setModalAutoSubmit] = useState(false);
	const progess = useProgressExam()
	const submit = useSubmitExam()
	let [activeSoal, setActiveSoal] = useState(0)
	let [payload, setPayload] = useState({
		id: examActive,
	})

	let { data, mutate, isLoading: isFetching } = useTakeExam()

	let [waktu, setWaktu] = useState(0)

	useEffect(() => {
		mutate(examActive, {
			onError: () => {
				setExamActive(null)
			},
		})
	}, [examActive, mutate, setExamActive])

	// Countdown effect
	useEffect(() => {
		let interval
		if (mouse && cutDown > 0) {
			interval = setInterval(() => {
				setCutDown((c) => c - 1)
			}, 1000)
		} else if (cutDown === 0) {
			window.location.reload() // Reload page when countdown reaches 0
		} else {
			clearInterval(interval)
		}
		return () => clearInterval(interval)
	}, [mouse, cutDown])

  // submit otomatis
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

	useEffect(() => {
		if (!!data?.data?.waktu_tersisa === true) {
			setWaktu(data?.data?.waktu_tersisa)
		}
		if (!!data?.data?.soal === true) {
			let res = JSON.parse(data.data.soal)
			setSoal(res)

			let dataSoal
			if (JSON.parse(data.data.jawaban).length === 0) {
				dataSoal = res.map((item) => ({
					id: item.id,
					tipe: item.tipe,
					jawaban: '',
					file: '',
				}))
			} else {
				dataSoal = JSON.parse(data.data.jawaban).map((item) => ({
					id: item.id,
					tipe: item.tipe,
					jawaban: item.jawaban,
					file: item.file,
				}))
			}

			setPayload((state) => {
				return {
					...state,
					data: dataSoal,
				}
			})
		}
	}, [data, isFetching])

	if (isFetching || data?.data?.soal === undefined) {
		return (
			<div className="fixed top-0 left-0 right-0 bottom-0 border pb-30 bg-white z-50 overflow-hidden">
				<Dimmer active inverted>
					<Loader size="large">Mengambil Data Soal</Loader>
				</Dimmer>
			</div>
		)
	}

	console.log(data.waktu_tersisa)

	return (
		<div
			// onMouseLeave={() => {
			//   setMouse(true); // Start countdown on mouse leave
			// }}
			// onMouseEnter={() => {
			//   setMouse(false); // Stop countdown on mouse enter, but don't reset it
			// }}
			className="fixed top-0 left-0 right-0 bottom-0 border pb-30 bg-white z-50 overflow-hidden"
		>
			<ModalKonfirmasi
				open={open}
				setOpen={setOpen}
				loading={submit.isLoading}
				onConfirm={() => {
					submit.mutate(payload, {
						onSuccess: () => {
							window.location.reload()
						},
					})
				}}
				title={'Apakah yakin akan mengakhiri ujian ?'}
			/>

			{mouse && cutDown > 0 && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="text-white text-4xl font-bold">Keluar dalam {cutDown} detik</div>
				</div>
			)}

      {modalAutoSubmit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-white text-4xl font-bold">Waktu sudah habis. Anda akan keluar dalam beberapa saat lagi...</div>
      </div>
      )}

			<div className="grid grid-cols-8 h-screen w-screen gap-5 p-5 ">
				<div id="scrollbar" className="col-span-6 h-screnn w-full overflow-auto px-10 pt-5 pb-32 border shadow-lg rounded-md">
					<div className="flex items-center justify-between">
						{data?.data?.tipe_ujian === 'closed' && <p className="text-red-500 font-bold">Jangan mengeluarkan mouse dari area ujian</p>}
						<span className="font-semibold text-lg">{convertSeconds(waktu)}</span>
					</div>

					{soal?.map((item, index) => {
						let soals = JSON.parse(item.soal)

						return (
							<React.Fragment key={index}>
								{index === activeSoal && (
									<div className="mb-3 flex items-center justify-between">
										<h3>
											Soal No. <span>{index + 1}</span>
										</h3>
									</div>
								)}
								<div>
									{index === activeSoal && item.tipe === 'PG' ? (
										<>
											<Pg item={item} soals={soals} payload={payload} setPayload={setPayload} />
										</>
									) : (
										<></>
									)}

									{index === activeSoal && item.tipe === 'TF' ? (
										<>
											<TF item={item} soals={soals} payload={payload} setPayload={setPayload} />
										</>
									) : (
										<></>
									)}
									{index === activeSoal && item.tipe === 'ES' ? (
										<>
											<ES tipe={data?.data?.tipe_ujian} item={item} soals={soals} payload={payload} setPayload={setPayload} />
										</>
									) : (
										<></>
									)}
								</div>
							</React.Fragment>
						)
					})}
				</div>

				<div className="col-span-2 h-screen w-full shadow-lg border rounded-md relative">
					<div className=" py-5 flex items-center justify-center">
						<h5>Nomor Soal</h5>
					</div>
					<div className=" px-5 shadow-lg h-full">
						{soal.map((item, index) => (
							<button
								disabled={waktu < 0}
								onClick={() => {
									setActiveSoal(index)
								}}
								key={index}
								className={clsx(`border m-2 hover:bg-blue-200 h-12 w-12 font-bold rounded-md `, {
									'bg-green-400 text-white': !!payload?.data?.[index]?.jawaban === true,
									'opacity-10': waktu < 0,
								})}
							>
								{index + 1}
							</button>
						))}
						<div className="space-y-2 absolute bottom-2 pb-10 right-0 left-0 px-5">
							<Button
								content={'Simpan Progress'}
								type="submit"
								fluid
								loading={progess.isLoading}
								disabled={progess.isLoading}
								onClick={() => {
									progess.mutate(payload)
								}}
								icon={() => <Icon name="save" />}
								size="medium"
								color="teal"
							/>
							<Button
								content={'Submit Exam'}
								type="submit"
								fluid
								loading={submit.isLoading}
								disabled={submit.isLoading}
								onClick={() => {
									setOpen(true)
								}}
								icon={() => <Icon name="save" />}
								size="medium"
								color="blue"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function convertSeconds(seconds) {
	const days = Math.floor(seconds / (24 * 3600))
	seconds %= 24 * 3600
	const hours = Math.floor(seconds / 3600)
	seconds %= 3600
	const minutes = Math.floor(seconds / 60)
	seconds %= 60

	if (days < 1) {
		if (hours < 1) {
			return ` ${minutes} menit, ${seconds} detik`
		} else {
			return `${hours} jam, ${minutes} menit, ${seconds} detik`
		}
	}

	return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`
}
