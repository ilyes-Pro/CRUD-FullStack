import { useState } from 'react';
import useProductStore from '../Store/productStore';

export default function CreatePage() {
  const { AddProduct } = useProductStore(); // الأفضل camelCase
  const [newProduct, setNewProduct] = useState({
    nameP: '',
    priceP: '', // نحولها لرقم
    imgP: null,
  });

  const handleAddProduct = () => {
    AddProduct(newProduct);
    setNewProduct({
      nameP: '',
      priceP: '',
      imgP: null,
    });
  };

  return (
    <div className="flex justify-center items-center mt-10 flex-col gap-13">
      <h1 className="text-Text font-bold text-[30px] ">Create New Product</h1>

      <div className="w-[450px] h-[250px] bg-bgCARD rounded-md ">
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
          />

          <input
            value={newProduct.priceP}
            onChange={(e) =>
              setNewProduct((prev) => ({
                ...prev,
                priceP: e.target.value,
              }))
            }
            type="text"
            placeholder="Price"
            className="border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3"
          />

          <input
            onChange={(e) =>
              setNewProduct((prev) => ({
                ...prev,
                imgP: e.target.files[0],
              }))
            }
            type="file"
            placeholder="Image URL"
            className="border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3"
          />

          <button
            className="bg-MainText w-11/12 h-10 rounded-md hover:transition hover:bg-blue-400 cursor-pointer"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
