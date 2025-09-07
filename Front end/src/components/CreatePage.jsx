import { useState, useRef } from 'react';
import useProductStore from '../Store/productStore';
import { ToastContainer, toast, Zoom, Slide } from 'react-toastify';

export default function CreatePage() {
  const [ShowImg, setShowImg] = useState(null);
  const fileInputRef = useRef(null);

  const { AddProduct } = useProductStore(); // الأفضل camelCase
  const [newProduct, setNewProduct] = useState({
    nameP: '',
    priceP: '', // نحولها لرقم
    imgP: null,
  });
  const [Er, setEr] = useState(false);
  const handleAddProduct = () => {
    setShowImg(null);
    setEr(false);
    AddProduct(
      newProduct,
      () => {
        setEr(false);
        console.log(Er);

        toast.success('is done');
      },
      (err) => {
        toast.error(err);
        setEr(true);
      }
    );
    setNewProduct({
      nameP: '',
      priceP: '',
      imgP: null,
    });
  };

  return (
    <>
      <div className="flex justify-center items-center mt-10 flex-col gap-8">
        <h1 className="text-Text font-bold text-[30px] ">Create New Product</h1>

        <div className="w-[450px] bg-bgCARD rounded-md pb-5">
          <div className="flex justify-center items-center flex-col gap-3 mt-7">
            <input
              value={newProduct.nameP}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  nameP: e.target.value,
                }))
              }
              type="text"
              placeholder="Product Name"
              className="border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3"
              style={{ borderColor: Er ? 'red' : 'none' }}
            />

            <input
              value={newProduct.priceP}
              onChange={(e) =>
                setNewProduct((prev) => ({
                  ...prev,
                  priceP: e.target.value,
                }))
              }
              type="number"
              placeholder="Price"
              className="border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3"
              style={{ borderColor: Er ? 'red' : 'none' }}
            />

            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewProduct((prev) => ({
                    ...prev,
                    imgP: e.target.files[0],
                  }));
                  setShowImg(URL.createObjectURL(file));
                }
              }}
              type="file"
              ref={fileInputRef}
              placeholder="Image URL"
              className="border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3"
              style={{ display: 'none' }}
            />
            <div className="flex justify-start items-start w-[90%] gap-2 flex-col">
              <div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Selct img
                </button>
              </div>
              {ShowImg && (
                <img
                  src={ShowImg}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              )}
            </div>
            <button
              className="bg-MainText w-11/12 h-10 rounded-md hover:transition hover:bg-blue-400 cursor-pointer"
              onClick={handleAddProduct}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        className="Toastify__toast-container  "
        toastClassName="!w-[300px] max-xs:!w-[50%] max-sm:!w-[80%] max-sm:text-xs max-xs:bottom-7 max-xs:right-3 max-sm:!rounded-md"
        position="bottom-right"
        autoClose={2000}
        transition={Slide}
        theme={document.body.classList.contains('dark') ? 'dark' : 'light'}
      />
    </>
  );
}
