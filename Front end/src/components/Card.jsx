import { Rocket, Upload } from 'lucide-react';
import Test from '../assets/keypord.jpg'
import { ShoppingCart } from 'lucide-react';
import { CopyPlus } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";


import { Button } from "@/components/ui/button"



import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';




export default function Card() {
    const [products, setProducts] = useState([]);
    const [Product, setProduct] = useState("update")

    useEffect(() => {
        axios.get('http://localhost:5000/AllProdacts')
            .then(response => {
                // Handle the response data
                setProducts(response.data);

            })
            .catch(error => {
                // Handle any errors
                console.error(error);
            });
    }, []);


    return (
        <>
            <Dialog>

                <div className=' container mx-auto pb-5'>
                    <div className='flex justify-center items-center mt-12 gap-1'>
                        <h1 className='text-MainText font-bold text-[22px]'>Current Products </h1>
                        <Rocket className='text-MainText' />
                    </div>



                    <div className='mt-10 flex items-center justify-center gap-6 flex-wrap'>
                        {products.map(productt => (
                            <div key={productt.id} className='w-[300px] bg-bgCARD rounded-md'>
                                <img src={productt.img_p} className='w-[100%] !h-[170px] rounded-t-md' />
                                <div className='p-3'>
                                    <h5 className='text-Textt font-medium'>{productt.name_p}</h5>
                                    <p className='text-Textt font-medium'>${productt.price_p}</p>
                                    <div className='flex  items-center  gap-3 mt-2'>

                                        <DialogTrigger asChild>

                                            <div onClick={() => setProduct("Update")} className='bg-blue-300 px-2 py-2 rounded-sm cursor-pointer hover:bg-blue-400 hover:transition'>
                                                <Pencil size={18} />
                                            </div>
                                        </DialogTrigger>

                                        <DialogTrigger asChild>
                                            <div onClick={() => setProduct("Delete")} className='bg-red-300 px-2 py-2 rounded-sm cursor-pointer hover:bg-red-400 hover:transition'>

                                                <Trash2 size={18} />
                                            </div>
                                        </DialogTrigger>
                                    </div>

                                </div>
                            </div>
                        ))}


                    </div>


                </div>



                <DialogContent >
                    <DialogHeader>
                        <DialogTitle>{Product}</DialogTitle>
                        <div className='flex flex-col gap-3.5'>
                            <input type="text" placeholder="Product Name" className=" border-solid border-2 border-gray-300 w-12/12 h-10 rounded-md text-gray-300 pl-3" />
                            <input type="text" placeholder="Price" className=" border-solid border-2 border-gray-300 w-12/12 h-10 rounded-md text-gray-300 pl-3" />
                            <input type="text" placeholder="Image URL" className=" border-solid border-2 border-gray-300 w-12/12 h-10 rounded-md text-gray-300 pl-3" />
                        </div>
                        <div className='flex justify-end gap-2 mt-2'>
                            <Button >{Product}</Button>
                            <DialogClose>
                                <Button variant='secondare'>Cancel</Button>
                            </DialogClose>
                        </div >
                        {/* <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription> */}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}