import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import PetAdopt from './pages/PetAdopt'
import PetCare from './pages/PetCare'
import Graveyard from './pages/Graveyard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
      <Route path="/Home" element={<Layout currentPageName="Home"><Home /></Layout>} />
      <Route path="/PetAdopt" element={<Layout currentPageName="PetAdopt"><PetAdopt /></Layout>} />
      <Route path="/PetCare" element={<Layout currentPageName="PetCare"><PetCare /></Layout>} />
      <Route path="/Graveyard" element={<Layout currentPageName="Graveyard"><Graveyard /></Layout>} />
    </Routes>
  )
}
