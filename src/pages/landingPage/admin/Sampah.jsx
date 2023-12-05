import { BsTrash3Fill } from "react-icons/bs";
import Sidebar from "./components/sidebar/sidebar";
import { HiOutlinePencil } from "react-icons/hi";
import { ButtonElement } from "../../../components/elements/button";
import { useEffect, useState } from "react";
import SampahEdit from "./components/Modal/SampahEdit";
import Modal from "../../../components/elements/modal/Modal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputElement } from "../../../components/elements/input";
import axios from "axios";

const Sampah = () => {
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [modalAddShow, setModalAddShow] = useState(false);
  const [tambahSampah, setTambahSampah] = useState({
    title: "",
    price: 0,
    description: "",
  });
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [sampahId, setSampahId] = useState();
  const [sampah, setSampah] = useState([]);
  const [errorMsg, setErrorMsg] = useState ();
  
  const handleEdit = (id) => {
    setModalEditShow(!modalEditShow);
    setSampahId(id);
  };
  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };
  const handleDelete = (id) => {
    setModalDeleteShow(!modalDeleteShow);
    setSampahId(id);
    
  };
  const handleAdd = () => {
    setModalAddShow(!modalAddShow);
    setPreview("");
  };
  const saveProduct = async () => {
    const formData = new FormData();

    // Menambahkan data ke objek FormData
    formData.append("title", tambahSampah.title);
    formData.append("file", file);
    formData.append("description", tambahSampah.description);
    formData.append("price", tambahSampah.price);

    try {
      await axios.post("http://localhost:4000/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    } catch (error) {
      console.log(error)
    }
    
  };
  const deleteData = async () => {
    try {
      await axios.delete (`http://localhost:4000/items/${sampahId}`)
    } catch (error) {
     
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.msg);
      } else if (error.message) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Terjadi kesalahan server");
      }
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTambahSampah((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    const url = "http://localhost:4000/items";
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setSampah(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "name", header: "Nama Sampah" },
    { field: "price", header: "Harga" },
    { field: "description", header: "Deskripsi" }, // Add this for action column
  ];

  const actionTemplate = (rowData) => (
    <div className="d-flex gap-2 p-1">
      <span
        className="text-success"
        onClick={() => handleEdit(rowData.id)}
        style={{ cursor: "pointer" }}
      >
        <HiOutlinePencil size={18} />
      </span>
      <span
        className="text-danger"
        style={{ cursor: "pointer" }}
        onClick={() => handleDelete(rowData.id)}
      >
        <BsTrash3Fill size={18} />
      </span>
    </div>
  );

  return (
    <>
      <Sidebar />
      <main className="main-content-admin">
        <div className="row">
          <div className="col-3">
            <ButtonElement
              type="submit"
              className="btn btn-success mb-3"
              handleClick={handleAdd}
            >
              Tambah Sampah
            </ButtonElement>
          </div>
        </div>

        <DataTable value={sampah} tableStyle={{ minWidth: "50rem" }}>
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
          <Column key="action" header="Aksi" body={actionTemplate} />
        </DataTable>

        {modalEditShow && <SampahEdit idSampah={sampahId} />}
        {modalDeleteShow && (
          
          <Modal
            title="Hapus Sampah"
            show={modalDeleteShow}
            onHide={handleDelete}
            closeButton={true}
          >
            <p>Yakin Untuk Menghapus Data ini ?</p>
            <div className="text-end">
              <form onSubmit={deleteData}>
              <ButtonElement type="submit" className="btn bg-danger text-white">
                Hapus
              </ButtonElement>
              </form>
            </div>
          </Modal>
        )}
        {modalAddShow && (
          <Modal
            title="Form Tambah Sampah"
            show={modalAddShow}
            onHide={handleAdd}
            closeButton={true}
          >
            <div>
              {preview ? (
                <figure className="text-center">
                  <img
                    src={preview}
                    alt="Preview Image"
                    style={{ width: "100px", height: "100px" }}
                  />
                </figure>
              ) : (
                ""
              )}
            </div>
            <form onSubmit={saveProduct}>
              <InputElement
                label="Nama Sampah"
                type="text"
                name="title"
                id="title"
                onChange={handleChange}
                className="mb-2"
                required
              />

              <InputElement
                label="Deskripsi"
                type="text"
                name="description"
                id="description"
                onChange={handleChange}
                className="mb-2"
                required
              />

              <InputElement
                label=" Harga (Rp)"
                type="number"
                name="price"
                id="price"
                onChange={handleChange}
                required
              />
              <div className="my-3">
                <label htmlFor="gambar-sampah" className="form-label">
                  Gambar
                </label>
                <input
                  className="form-control"
                  type="file"
                  name="image"
                  id="image"
                  onChange={loadImage}
                  required
                />
              </div>
              <div className="text-end">
                <ButtonElement
                  type="submit"
                  className="btn btn-success"
                  isLoading={false}
                >
                  Simpan
                </ButtonElement>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </>
  );
};

export default Sampah;
