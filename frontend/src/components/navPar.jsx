import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import { CopyPlus } from 'lucide-react';
import { Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet } from "react-router-dom";
import { Moon } from 'lucide-react';




export default function NavPar() {
    const [dark, setDark] = useState('')


    useEffect(() => {
        const saved = localStorage.getItem("status");
        const theme = saved ? saved : "dark"; // default dark
        setDark(theme);

        if (theme === "light") {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }
    }, []);

    function modDark() {
        const newTheme = dark === "light" ? "dark" : "light";
        setDark(newTheme);
        localStorage.setItem("status", newTheme);
        document.body.classList.toggle("dark");
    }


    return (
        <>
            <div className='flex justify-between items-center w-9/12 mx-auto pt-3 max-xs:w-11/12'>
                <div className='flex justify-center items-center gap-3'>
                    <Link to="/">
                        <h2 className='text-MainText font-bold text-xl'>PRODUCT STORE</h2>
                    </Link>
                    <ShoppingCart className='text-MainText' />
                </div>

                <div className='flex  items-center  gap-3'>
                    <Link to="/CreateProduct">
                        <div className='bg-bg px-2 py-1.5 rounded-sm cursor-pointer hover:bg-[#7f8185] hover:transition'>
                            <CopyPlus size={22} color='white' />
                        </div>
                    </Link>
                    <div onClick={modDark} className='bg-bg px-2 py-1.5 rounded-sm cursor-pointer hover:bg-[#7f8185] hover:transition'>

                        {dark == 'dark' ? (<Moon size={22} color='white' />) : (<Sun size={22} color='white' />)}
                    </div>

                </div>

            </div>




            <Outlet />

        </>
    )
}