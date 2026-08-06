import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/header'
import RequireAuth from './components/RequireAuth'

import Login from './pages/login/Login'
import Dashboard from './pages/Dashboard'
import GroupUser from './pages/setting/GroupUser'
import UserManagement from './pages/setting/UserManagement'
import MenuAccess from './pages/setting/MenuAccess'
import Office from './pages/office/Office'
import AreaLogistic from './pages/master-data/logistics/AreaLogistic'
import DivisionLogistic from './pages/master-data/logistics/DivisionLogistic'
import ServicesLogistic from './pages/master-data/logistics/ServicesLogistic'
import VehiclesLogistic from './pages/master-data/logistics/VehiclesLogistic'
import Vendor from './pages/master-data/Vendor'
import ShipmentStatus from './pages/master-data/ShipmentStatus'
import Perkiraan from './pages/master-data/Perkiraan'
import Akunting from './pages/akunting/Akunting'
import Marketing from './pages/module/Marketing'
import Transaction from './pages/module/Transaction'
import Booking from './pages/module/Booking'
import Operations from './pages/module/Operations'
import BranchReport from './pages/reports/BranchReport'
import CourierReport from './pages/reports/CourierReport'
import FinancialReport from './pages/reports/FinancialReport'
import CustomerReports from './pages/reports/CustomerReports'
import Ticketting from './pages/ticketting/Ticketting'
import Profile from './pages/Profile'

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route element={<RequireAuth />}> */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/group-user" element={<GroupUser />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/hak-akses-menu" element={<MenuAccess />} />
          <Route path="/office" element={<Office />} />
          <Route path="/logistics/areas" element={<AreaLogistic />} />
          <Route path="/logistics/division" element={<DivisionLogistic />} />
          <Route path="/logistics/services" element={<ServicesLogistic />} />
          <Route path="/logistics/vehicles" element={<VehiclesLogistic />} />
          <Route path="/vendor" element={<Vendor />} />
          <Route path="/perkiraan" element={<Perkiraan />} />
          <Route path="/akunting" element={<Akunting />} />
          <Route path="/shipment-status" element={<ShipmentStatus />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/branch-reports" element={<BranchReport />} />
          <Route path="/courier-reports" element={<CourierReport />} />
          <Route path="/financial-reports" element={<FinancialReport />} />
          <Route path="/customer-reports" element={<CustomerReports />} />
          <Route path="/ticketting" element={<Ticketting />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      {/* </Route> */}
    </Routes>
  )
}

export default App
