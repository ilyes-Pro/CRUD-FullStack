import { Rocket, Upload } from 'lucide-react';

import { ShoppingCart } from 'lucide-react';
import { CopyPlus } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState, useEffect, useRef } from 'react';
import useProductStore from '../Store/productStore';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer, toast, Zoom, Slide } from 'react-toastify';

export default function Card() {
  const [ShowImg, setShowImg] = useState(null);
  const fileInputRef = useRef(null);

  const { ShowProducts, products, EditProduct, DeleteProdect, loading } =
    useProductStore();
  const [Er, setEr] = useState(false);
  const [Open, setOpen] = useState(false);
  const [updateP, setUpdateP] = useState({
    id: '',
    nameP: '',
    priceP: '',
    imgP: null,
  });

  useEffect(() => {
    ShowProducts();
  }, [ShowProducts]);

  function Update(a) {
    setUpdateP({
      id: a.id,
      nameP: a.name_p,
      priceP: a.price_p,
      imgP: a.img_p,
    });
  }

  function Updat02() {
    console.log('this is udate', updateP);
    EditProduct(
      updateP,
      () => {
        toast.success('Operation is Successful');
        setOpen(false);
        setEr(false);
      },
      (err) => {
        toast.error(err);
        setEr(true);
        setOpen(true);
      }
    );
  }

  function Delete(id) {
    DeleteProdect(id);
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <ClipLoader color="#42C6F5" size={70} />
      </div>
    );
  }

  return (
    <>
      <Dialog open={Open} onOpenChange={setOpen}>
        <div className=" container mx-auto pb-5">
          <div className="flex justify-center items-center mt-12 gap-1">
            <h1 className="text-MainText font-bold text-[22px]">
              Current Products{' '}
            </h1>
            <Rocket className="text-MainText" />
            <span className="text-MainText font-bold text-[22px]">
              ({products.length})
            </span>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 flex-wrap">
            {products.length > 0 ? (
              products.map((productt) => (
                <div
                  key={productt.id}
                  className="w-[300px] bg-bgCARD rounded-md transition hover:translate-y-[-10px]"
                >
                  <img
                    src={productt.img_p}
                    className="w-[100%] !h-[170px] rounded-t-md"
                  />
                  <div className="p-3">
                    <h5 className="text-Textt font-medium">
                      {productt.name_p}
                    </h5>
                    <p className="text-Textt font-medium">
                      ${productt.price_p}
                    </p>
                    <div className="flex  items-center  gap-3 mt-2">
                      <DialogTrigger asChild>
                        <div
                          onClick={() => Update(productt)}
                          className="bg-blue-300 px-2 py-2 rounded-sm cursor-pointer hover:bg-blue-400 hover:transition"
                        >
                          <Pencil size={18} />
                        </div>
                      </DialogTrigger>

                      <div
                        onClick={() => Delete(productt.id)}
                        className="bg-red-300 px-2 py-2 rounded-sm cursor-pointer hover:bg-red-400 hover:transition"
                      >
                        <Trash2 size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <h3>
                  No products found{' '}
                  <Link
                    to="/CreateProduct"
                    className="text-MainText hover:border-b-2"
                  >
                    Create a product
                  </Link>
                </h3>
              </div>
            )}
          </div>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>update</DialogTitle>
            <div className="flex flex-col gap-3.5">
              <input
                value={updateP.nameP}
                onChange={(e) =>
                  setUpdateP((prev) => ({
                    ...prev,
                    nameP: e.target.value,
                  }))
                }
                type="text"
                placeholder="Product Name"
                className=" border-solid border-2 border-gray-300 w-12/12 h-10 rounded-md text-Text pl-3"
                style={{ borderColor: Er ? 'red' : 'none' }}
              />

              <input
                value={updateP.priceP}
                onChange={(e) =>
                  setUpdateP((prev) => ({
                    ...prev,
                    priceP: e.target.value,
                  }))
                }
                type="number"
                placeholder="Price"
                className=" border-solid border-2 border-gray-300 w-12/12 h-10 rounded-md text-Text pl-3"
                style={{ borderColor: Er ? 'red' : 'none' }}
              />

              <input
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setUpdateP((prev) => ({
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
                    className="bg-blue-500  px-4 py-2 rounded-md cursor-pointer text-Text"
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
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <DialogClose>
                <Button onClick={Updat02} className="text-Text">
                  update
                </Button>
              </DialogClose>

              <DialogClose>
                <Button
                  variant="secondare"
                  onClick={() => setShowImg(null)}
                  className="text-Text"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
            {/* <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <ToastContainer
        className="Toastify__toast-container  "
        toastClassName="!bg-bgCARD !w-[300px] max-xs:!w-[50%] max-sm:!w-[80%] max-sm:text-xs max-xs:bottom-7 max-xs:right-3 max-sm:!rounded-md !text-Text"
        position="bottom-right"
        autoClose={3000}
        transition={Slide}
        theme={document.body.classList.contains('dark') ? 'dark' : 'light'}
      />
    </>
  );
}
