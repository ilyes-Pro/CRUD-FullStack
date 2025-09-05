

export default function CreatePage() {



    return (

        <div className='flex justify-center items-center mt-10 flex-col gap-13'>
            <h1 className='text-Text font-bold text-[30px] '>Create New Product </h1>

            <div className='w-[450px] h-[250px] bg-bgCARD rounded-md '>
                <div className='flex justify-center items-center  flex-col gap-3 mt-7'>

                    <input type="text" placeholder="Product Name" className=" border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3" />

                    <input type="text" placeholder="Price" className=" border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3" />
                    <input type="text" placeholder="Image URL" className=" border-solid border-2 border-gray-300 w-11/12 h-10 rounded-md text-gray-300 pl-3" />
                    <button className="  bg-MainText w-11/12 h-10 rounded-md hover:transition hover:bg-blue-400 cursor-pointer"> Add Product</button>

                </div>

            </div>

        </div>
    )
}