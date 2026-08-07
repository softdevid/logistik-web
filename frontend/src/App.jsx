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
import BranchReportsIndex from './pages/reports/branch/BranchReportsIndex'
import TransactionDetailsReport from './pages/reports/branch/TransactionDetailsReport'
import ManifestOutboundReport from './pages/reports/branch/ManifestOutboundReport'
import DeliveryReport from './pages/reports/branch/DeliveryReport'
import GrossProfitReport from './pages/reports/branch/GrossProfitReport'
import RekapGrossProfitReport from './pages/reports/branch/RekapGrossProfitReport'
import ManifestVendorReport from './pages/reports/branch/ManifestVendorReport'
import AwbReport from './pages/reports/branch/AwbReport'
import CustomerMonthlySummaryReport from './pages/reports/branch/CustomerMonthlySummaryReport'
import DailyTurnoverSummaryReport from './pages/reports/branch/DailyTurnoverSummaryReport'
import InboundTransactionDetailsReport from './pages/reports/branch/InboundTransactionDetailsReport'
import CourierReport from './pages/reports/CourierReport'
import FinancialReport from './pages/reports/FinancialReport'
import CustomerReports from './pages/reports/CustomerReports'
import Ticketting from './pages/ticketting/Ticketting'
import Profile from './pages/Profile'
import Manifest from './pages/module/Manifest'

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
      <Route element={<RequireAuth />}>
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
          <Route path="/manifest" element={<Manifest />} />
          <Route path="/branch-reports" element={<BranchReportsIndex />} />
          <Route path="/branch-reports/transaction-details" element={<TransactionDetailsReport />} />
          <Route path="/branch-reports/manifest-outbound" element={<ManifestOutboundReport />} />
          <Route path="/branch-reports/delivery" element={<DeliveryReport />} />
          <Route path="/branch-reports/gross-profit" element={<GrossProfitReport />} />
          <Route path="/branch-reports/rekap-gross-profit" element={<RekapGrossProfitReport />} />
          <Route path="/branch-reports/manifest-vendor" element={<ManifestVendorReport />} />
          <Route path="/branch-reports/awb" element={<AwbReport />} />
          <Route path="/branch-reports/customer-monthly-summary" element={<CustomerMonthlySummaryReport />} />
          <Route path="/branch-reports/daily-turnover-summary" element={<DailyTurnoverSummaryReport />} />
          <Route path="/branch-reports/inbound-transaction-details" element={<InboundTransactionDetailsReport />} />
          <Route path="/courier-reports" element={<CourierReport />} />
          <Route path="/financial-reports" element={<FinancialReport />} />
          <Route path="/customer-reports" element={<CustomerReports />} />
          <Route path="/ticketting" element={<Ticketting />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
