import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  DocumentTextIcon,
  TruckIcon,
  CurrencyDollarIcon,
  BuildingStorefrontIcon,
  GlobeAltIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const REPORTS = [
  { name: "Detail Transaksi", link: "/branch-reports/transaction-details", icon: DocumentTextIcon, description: "Rekap seluruh transaksi per cabang" },
  { name: "Manifest Outbound", link: "/branch-reports/manifest-outbound", icon: TruckIcon, description: "Rekap manifest pengiriman keluar" },
  { name: "Pengantaran", link: "/branch-reports/delivery", icon: TruckIcon, description: "Rekap proses pengantaran per kurir" },
  { name: "Gross Profit", link: "/branch-reports/gross-profit", icon: CurrencyDollarIcon, description: "Daftar manifest untuk perhitungan laba kotor" },
  { name: "Rekap Gross Profit", link: "/branch-reports/rekap-gross-profit", icon: ClipboardDocumentListIcon, description: "Rekap manifest per kendaraan dan driver" },
  { name: "Manifest Vendor", link: "/branch-reports/manifest-vendor", icon: BuildingStorefrontIcon, description: "Rekap manifest vendor ekspedisi" },
  { name: "AWB", link: "/branch-reports/awb", icon: GlobeAltIcon, description: "Daftar seluruh Airway Bill" },
  { name: "Rekap Customer Bulanan", link: "/branch-reports/customer-monthly-summary", icon: UsersIcon, description: "Rekapitulasi omzet customer per bulan" },
  { name: "Rekap Omset Harian", link: "/branch-reports/daily-turnover-summary", icon: CalendarDaysIcon, description: "Rekapitulasi omset harian per cabang" },
  { name: "Detail Transaksi Inbound", link: "/branch-reports/inbound-transaction-details", icon: ArrowDownTrayIcon, description: "Rekap transaksi barang masuk" },
];

export default function BranchReportsIndex() {
  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Laporan
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Laporan Cabang
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Pilih salah satu laporan untuk melihat detailnya.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REPORTS.map((report) => {
            const Icon = report.icon;
            return (
              <Link
                key={report.link}
                to={report.link}
                className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-[#0F5C4C]/30 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0F5C4C]/[0.08] text-[#0F5C4C] transition-colors group-hover:bg-[#0F5C4C] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {report.name}
                    </h3>
                    <ChevronRightIcon className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0F5C4C]" />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{report.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
