import { useState } from "react";

import { toast } from "react-toastify";

function useDelete({ afterDeleted, onDelete, onCancel }) {
  let [showAlertDelete, setShowAlertDelete] = useState(false);

  let [id, setId] = useState(null);

  let [deleteLoading, setDeleteLoading] = useState(false);
  let [deleteLoading2, setDeleteLoading2] = useState(false);

  async function onConfirmDelete() {
    try {
      setDeleteLoading(true);
      let response = await onDelete(id);
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
      afterDeleted(id);
      setDeleteLoading(false);
      setShowAlertDelete(false);
    } catch (error) {
      setDeleteLoading(false);
      setShowAlertDelete(false);
      toast.error("Ada Kesalahan", {
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
  }
  async function onConfirmCancel() {
    try {
      setDeleteLoading2(true);
      let response = await onCancel(id);
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
      afterDeleted();
      setDeleteLoading2(false);
      setShowAlertDelete(false);
    } catch (error) {
      setDeleteLoading(false);
      setShowAlertDelete(false);

      toast.error("Ada Kesalahan", {
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
  }

  function confirmDelete(newID) {
    setId(newID);
    setShowAlertDelete(true);
  }
  function confirmCancel(newID) {
    setId(newID);
    setShowAlertDelete(true);
  }

  return {
    showAlertDelete,
    setShowAlertDelete,
    deleteLoading,
    deleteLoading2,
    confirmDelete,
    onConfirmDelete,
    confirmCancel,
    onConfirmCancel,
  };
}

export default useDelete;
