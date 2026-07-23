import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/header'

import Dashboard from './pages/Dashboard'
import GrupUser from './pages/setting/GrupUser'
import ManajemenUser from './pages/setting/ManajemenUser'
import HakAksesMenu from './pages/setting/HakAksesMenu'
import Perusahaan from './pages/kantor/Perusahaan'
import KantorCabang from './pages/kantor/KantorCabang'
import DaftarLogistik from './pages/master-data/DaftarLogistik'
import Kategori from './pages/master-data/Kategori'
import Satuan from './pages/master-data/Satuan'
import Vendor from './pages/master-data/Vendor'
import ShipmentStatus from './pages/master-data/ShipmentStatus'
import MarketingSales from './pages/modul/MarketingSales'
import CustomerService from './pages/modul/CustomerService'
import Operasional from './pages/modul/Operasional'
import LaporanCabang from './pages/laporan/LaporanCabang'
import LaporanKurir from './pages/laporan/LaporanKurir'
import LaporanKeuangan from './pages/laporan/LaporanKeuangan'
import CustomerReports from './pages/laporan/CustomerReports'
import Profil from './pages/Profil'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/group-user" element={<GrupUser />} />
        <Route path="/user-management" element={<ManajemenUser />} />
        <Route path="/hak-akses-menu" element={<HakAksesMenu />} />
        <Route path="/company" element={<Perusahaan />} />
        <Route path="/branch-offices" element={<KantorCabang />} />
        <Route path="/logistic" element={<DaftarLogistik />} />
        <Route path="/logistic/category" element={<Kategori />} />
        <Route path="/logistic/unit" element={<Satuan />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/shipment-status" element={<ShipmentStatus />} />
        <Route path="/marketing-sales" element={<MarketingSales />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/operations" element={<Operasional />} />
        <Route path="/branch-reports" element={<LaporanCabang />} />
        <Route path="/courier-reports" element={<LaporanKurir />} />
        <Route path="/financial-reports" element={<LaporanKeuangan />} />
        <Route path="/customer-reports" element={<CustomerReports />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </>
  )
}

export default App
