import { useState } from 'react'
import { Routes, Route } from "react-router-dom";


import './App.css'


//components
import Card from './components/Card'
import Nav from './components/navPar'
import CreatePage from './components/CreatePage'

function App() {


  return (

    <div className='bg-bgMain min-h-screen '>
      <Routes>
        <Route path='/' element={<Nav />}>

          <Route index element={<Card />} />
          <Route path='CreateProduct' element={<CreatePage />} />
        </Route>

      </Routes>



    </div>


  )
}

export default App
