import {
  Button,
  Divider,
  Form,
  Header,
  Icon,
  Input,
  Segment,
  TextArea,
} from "semantic-ui-react";
import LayoutPage from "../../../module/layoutPage";
import { ReactSelectAsync, FormLabel } from "../../../components";
import Editor from "../../../components/Editor";
import * as Yup from "yup";
import { Formik } from "formik";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { createNotice, detailNotice, updateNotice } from "../../../api/guru/notice";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

function EditNotice() {
  let noticeSchema = Yup.object().shape({
    pengumuman: Yup.string().required("wajib diisi"),
    judul_notice: Yup.string().required("wajib pilih"),
    isi_notice: Yup.string().required("wajib diisi"),
  });

  const {id} = useParams()
  const [previewImage, setPreviewImage] = useState(null)

  let { data, isLoading, isFetching } = useQuery(
    //query key
    ["detail_notice"],
    //axios function,triggered when page/pageSize change
    () => detailNotice(id),
    //configuration
    {
      refetchInterval: 1000 * 60 * 60,
      select: (response) => {
        return response.data;
      },
      onSuccess: (response) => {
        setPreviewImage(response?.data?.gambar_notice)
      },
      refetchOnWindowFocus: false
    }
  );

  const initialValue = {
    tanggal_pengumuman: dayjs(new Date(data?.data?.tanggal_pengumuman)).format("YYYY-MM-DD"),
    judul_notice: data?.data?.judul_notice || "",
    isi_notice: data?.data?.isi_notice || "",
  };

  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  let [image, setImage] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      let alamat = URL.createObjectURL(file);
      console.log(alamat);
      setPreviewImage(alamat)
    }
  };
  // const previewImage = useMemo(() => {
  //   let alamat;
  //   if (image) {
  //     alamat = URL.createObjectURL(image);
  //   }
  //   return alamat;
  // }, [image]);

  console.log(previewImage);

  const hiddenFileInput = useRef(null); // ADDED

  const handleUploadClick = (event) => {
    hiddenFileInput.current.click(); // ADDED
  };

  

  const onSubmit = async (values) => {
    console.log(values);
    setIsUploading(true);
    const compiled = new FormData();

    // if (image == null) {
    //   return toast.error("Harap masukkan image", {
    //     position: "top-right",
    //     autoClose: 1000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //   });
    // }
    if (image !== null) {

      compiled.append("gambar_notice", image);
    }
    compiled.append("judul_notice", values.judul_notice);
    compiled.append("tanggal_pengumuman", values.tanggal_pengumuman);
    compiled.append("isi_notice", values.isi_notice);

    try {
      let response = await updateNotice(id,compiled);
      console.log(response);
      queryClient.invalidateQueries("list_notice");

      setIsUploading(false);
      return toast.success(response?.data?.msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        onClick: () => navigate("/guru/notice"),
        onClose: () => navigate("/guru/notice"),

        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    } catch (err) {
      console.log(err);
      return toast.warning(err.response.data.msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  

  return (
    <LayoutPage title={"Edit Notice"} isLoading={isLoading}>
      <Formik
        initialValues={initialValue}
        validationSchema={noticeSchema}

        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          values,
          setValues,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldTouched,
          setFieldValue,
          resetForm,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 border p-5 mt-3 shadow-md">
              {/* <div className="col-span-3 flex justify-end ">
                      <DeleteButton
                        disabled={values.sholat.length <= 1}
                        onClick={() => {
                          let filtered = values.sholat.filter((i, itemIndex) => {
                            return itemIndex != index;
                          });
      
                          setFieldValue("sholat", filtered);
                        }}
                        size="small"
                      />
                    </div> */}
              <input
                type="file"
                accept="image/*"
                name="image"
                id="image"
                className="hidden"
                ref={hiddenFileInput}
                onChange={handleImageChange}
              />
              {previewImage == null ? (
                <div className="row-span-2 bg-green-50 col-span-1 grid place-items-center h-60">
                  <label htmlFor="image" className="">
                    <Button primary type="button" onClick={handleUploadClick}>
                      upload
                    </Button>
                  </label>
                </div>
              ) : (
                <div className="row-span-2 bg-blue-50 col-span-1 relative group h-60">
                  <img
                    src={previewImage}
                    alt="uploaded"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-150 grid place-content-center">
                    <Button primary type="button" onClick={handleUploadClick}>
                      change image
                    </Button>
                  </div>
                </div>
              )}
              <div className="col-span-3 lg:col-span-1">
                <Form.Field
                  control={Input}
                  label="Tanggal"
                  placeholder="Tanggal"
                  name={`tanggal_pengumuman`}
                  onChange={(event, value) => {
                    setFieldValue(
                      "tanggal_pengumuman",
                      dayjs(value.value).format("YYYY-MM-DD")
                    );
                    console.log(value.value);
                  }}
                  onBlur={handleBlur}
                  value={dayjs(values.tanggal_pengumuman).format("YYYY-MM-DD")}
                  disabled={isSubmitting}
                  fluid
                  // error={
                  //   errors.sholat?.[index]?.tanggal &&
                  //   touched.sholat?.[index]?.tanggal && {
                  //     content: `${errors?.sholat?.[index]?.tanggal}`,
                  //     pointing: "above",
                  //     color: "red",
                  //     basic: true,
                  //   }
                  // }
                  type="date"
                />
              </div>
              {/* <div className="col-span-3 lg:col-span-1">
                      <FormLabel
                        // error={
                        //   errors?.sholat?.[index]?.student_id &&
                        //   touched?.sholat?.[index]?.student_id
                        // }
                        label={"Nama Siswa"}
                      >
                        <ReactSelectAsync
                          debounceTimeout={300}
                          value={value?.nama_siswa}
                          loadOptions={listSiswaOptions}
                          isDisabled={isSubmitting}
                          onChange={(data) => {
                            console.log(data);
                            setFieldValue(`sholat[${index}]nama_siswa`, data);
                            setFieldValue(`sholat[${index}]student_id`, data.value);
                          }}
                          error={
                            errors?.sholat?.[index]?.student_id &&
                            touched?.sholat?.[index]?.student_id
                          }
                          placeholder="Nama Siswa"
                          additional={{
                            page: 1,
                          }}
                        />
                      </FormLabel>
                    </div> */}
              {/* <div className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Select}
                        options={waktusholatOptions}
                        label={{
                          children: "Waktu",
                          htmlFor: `sholat[${index}]waktu`,
                          name: `sholat[${index}]waktu`,
                        }}
                        onChange={(event, data) => {
                          setFieldValue(`sholat[${index}]waktu`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.waktu}
                        placeholder="Pilih Waktu"
                        error={
                          errors?.sholat?.[index]?.waktu &&
                          touched?.sholat?.[index]?.waktu && {
                            content: `${errors?.sholat?.[index]?.waktu}`,
                            pointing: "above",
                          }
                        }
                        disabled={isSubmitting}
                        search
                        searchInput={{
                          id: `sholat[${index}]waktu`,
                          name: `sholat[${index}]waktu`,
                        }}
                      />
                    </div> */}

              {/* <div className="col-span-3 lg:col-span-1">
                      <Form.Field
                        control={Select}
                        options={alasanTidakSholatOptions}
                        label={{
                          children: "Jenis Pelanggaran",
                          htmlFor: `sholat[${index}]keterangan`,
                          name: `sholat[${index}]keterangan`,
                        }}
                        onChange={(event, data) => {
                          setFieldValue(`sholat[${index}]keterangan`, data.value);
                        }}
                        onBlur={handleBlur}
                        value={value?.keterangan}
                        placeholder="Pilih Katerangan"
                        error={
                          errors?.sholat?.[index]?.keterangan &&
                          touched?.sholat?.[index]?.keterangan && {
                            content: `${errors?.sholat?.[index]?.keterangan}`,
                            pointing: "above",
                          }
                        }
                        disabled={isSubmitting}
                        search
                        searchInput={{
                          id: `sholat[${index}]keterangan`,
                          name: `sholat[${index}]keterangan`,
                        }}
                      />
                    </div> */}

              <div className="col-span-1 col-start-3">
                <Form.Field
                  control={Input}
                  label="Judul"
                  placeholder="Alasan"
                  name={`judul_notice`}
                  value={values.judul_notice}
                  onChange={handleChange}
                  fluid
                  type="text"
                  disabled={isSubmitting}
                  error={errors?.judul_notice}
                />
              </div>
              {/* <div className="col-span-2 mt-2">
                <Form.Field
                  control={TextArea}
                  label="Isi Notice"
                  placeholder="Isi Notice..."
                  name={`isi_notice`}
                  value={values.isi_notice}
                  onChange={handleChange}
                  fluid
                  type="text"
                  disabled={isSubmitting}
                  error={errors?.isi_notice}
                  className="h-full"
                />
              </div> */}
              <div className="mb-5 col-span-2">
                      <FormLabel>Isi Notice</FormLabel>
                      <Editor
                        error={errors?.isi_notice}
                        value={values.isi_notice}
                        handleChange={(content) => {
                          setFieldValue(`isi_notice`, content);
                          console.log(content);
                        }}
                      />
                    </div>
            </div>
            {/* <Segment basic textAlign="center">
                  {mode === "add" && (
                    <Button
                      basic
                      fluid
                      type="button"
                      onClick={() => {
                        setFieldValue("sholat", [
                          ...values.sholat,
                          {
                            tanggal: "",
                            student_id: "",
                            waktu: "",
                            alasan: "",
                            keterangan: "",
                          },
                        ]);
                      }}
                      color="teal"
                      content="Tambah"
                      labelPosition="left"
                    />
                  )}
                </Segment> */}

            <div className="grid grid-cols-3 gap-5 mt-5 ">
              <div className="col-start-1 lg:col-start-3 grid col-span-3  gap-x-5">
                {/* <Button
                      content={"Batal"}
                      type="button"
                      fluid
                      icon={() => <Icon name="cancel" />}
                      basic
                      // onClick={() => {
                      //   // setValues(initialValue);
                      //   setIsOpen(false);
                      //   resetForm();
                      // }}
                      size="medium"
                      color="red"
                      // disabled={isSubmitting}
                    /> */}
                <Button
                  content={"Simpan"}
                  type="submit"
                  onClick={() => onSubmit(values)}
                  fluid
                  icon={() => <Icon name="save" />}
                  basic
                  size="medium"
                  color="teal"
                  loading={isUploading}
                  disabled={isUploading}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </LayoutPage>
  );
}

export default EditNotice;
