import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/header'

import Dashboard from './pages/Dashboard'
import GroupUser from './pages/setting/GroupUser'
import UserManagement from './pages/setting/UserManagement'
import MenuAccess from './pages/setting/MenuAccess'
import Company from './pages/office/Company'
import BranchOffice from './pages/office/BranchOffice'
import LogisticList from './pages/master-data/LogisticList'
import Category from './pages/master-data/Category'
import Unit from './pages/master-data/Unit'
import Vendor from './pages/master-data/Vendor'
import ShipmentStatus from './pages/master-data/ShipmentStatus'
import MarketingSales from './pages/module/MarketingSales'
import CustomerService from './pages/module/CustomerService'
import Operations from './pages/module/Operations'
import BranchReport from './pages/reports/BranchReport'
import CourierReport from './pages/reports/CourierReport'
import FinancialReport from './pages/reports/FinancialReport'
import CustomerReports from './pages/reports/CustomerReports'
import Ticketting from './pages/ticketting/Ticketting'
import Profile from './pages/Profile'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/group-user" element={<GroupUser />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/hak-akses-menu" element={<MenuAccess />} />
        <Route path="/company" element={<Company />} />
        <Route path="/branch-offices" element={<BranchOffice />} />
        <Route path="/logistic" element={<LogisticList />} />
        <Route path="/logistic/category" element={<Category />} />
        <Route path="/logistic/unit" element={<Unit />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/shipment-status" element={<ShipmentStatus />} />
        <Route path="/marketing-sales" element={<MarketingSales />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/branch-reports" element={<BranchReport />} />
        <Route path="/courier-reports" element={<CourierReport />} />
        <Route path="/financial-reports" element={<FinancialReport />} />
        <Route path="/customer-reports" element={<CustomerReports />} />
        <Route path="/ticketting" element={<Ticketting />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
