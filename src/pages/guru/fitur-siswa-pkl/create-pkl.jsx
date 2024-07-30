import React from 'react'
import useList from '../../../hook/useList';
import LayoutPage from '../../../module/layoutPage';
import { Formik } from 'formik';
import { Form } from 'semantic-ui-react';
import { DeleteButton } from '../../../components';

export const CreatePkl = () => {
  const queryClient = useQueryClient();
  let [visible, setVisible] = React.useState(false);
  const [initialState, setInitialState] = React.useState({
    data: [
      {
        student_id: "",
        student_name: "",
        perusahaan_name: "",
        daerah_perusahaan_name: "",
        nomertelepon: "",
      }
    ]
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await createSiswaHandle(values);
      toast.success(response?.data?.msg, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      resetForm();
      setInitialState({
        data: [
          {
            student_id: "",
            student_name: "",
            perusahaan_name: "",
            daerah_perusahaan_name: "",
            nomertelepon: "",
          }
        ]
      });
      queryClient.invalidateQueries("siswa/list");
    }
    catch (err) {
      if (err?.response?.status === 422) {
        return toast.warn(err?.response?.data?.msg, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      }
      return toast.error("Ada Kesalahan", {
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
  let {
    dataKelas, dataGuru
  } = useList()
  return (
    <LayoutPage title={"Tambah Tempat PKL santri"} visible={visible} setVisible={setVisible}>
      <section className='mt-5'>
        <Formik initialValues={initialState} enableReinitialize onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form onSubmit={handleSubmit}>
              {JSON.stringify(values)}
              <div className="space-y-5">
                {values?.data?.map((values, index) => {
                  return (
                    <>
                      <div className="col-span-3 flex justify-end">
                        <DeleteButton disabled={values.data.length <= 1} onClick={() => {
                          let filtered = values.data.filter(
                            (i, itemIndex) => {
                              return itemIndex !== index;
                            }
                          );
                        }}></DeleteButton>
                      </div>
                    </>
                  )
                })}
              </div>
            </Form>
          )}

        </Formik>
      </section>
    </LayoutPage>
  )
}
