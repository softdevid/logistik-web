import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  BanknotesIcon,
  CreditCardIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// ============ DATA SEMENTARA (placeholder, nanti diganti API) ============

// total = 189.730.987 (cash 55.132.862 + kredit 134.571.159 + cod 0 + tunai-transfer 26.966)
const transactionMonthly = [
  { month: "Jan", cash: 4800000, kredit: 12500000, cod: 0, tunaiTransfer: 0 },
  { month: "Feb", cash: 5200000, kredit: 11800000, cod: 0, tunaiTransfer: 0 },
  { month: "Mar", cash: 3900000, kredit: 13200000, cod: 0, tunaiTransfer: 0 },
  { month: "Apr", cash: 6100000, kredit: 9900000, cod: 0, tunaiTransfer: 0 },
  { month: "Mei", cash: 4450000, kredit: 10500000, cod: 0, tunaiTransfer: 0 },
  { month: "Jun", cash: 5680000, kredit: 14600000, cod: 0, tunaiTransfer: 26966 },
  { month: "Jul", cash: 3750000, kredit: 11750000, cod: 0, tunaiTransfer: 0 },
  { month: "Agu", cash: 5120862, kredit: 10900000, cod: 0, tunaiTransfer: 0 },
  { month: "Sep", cash: 4900000, kredit: 8900000, cod: 0, tunaiTransfer: 0 },
  { month: "Okt", cash: 4300000, kredit: 12300000, cod: 0, tunaiTransfer: 0 },
  { month: "Nov", cash: 3600000, kredit: 9300000, cod: 0, tunaiTransfer: 0 },
  { month: "Des", cash: 3332000, kredit: 8921159, cod: 0, tunaiTransfer: 0 },
];

const transactionTotals = transactionMonthly.reduce(
  (acc, m) => {
    acc.cash += m.cash;
    acc.kredit += m.kredit;
    acc.cod += m.cod;
    acc.tunaiTransfer += m.tunaiTransfer;
    acc.total += m.cash + m.kredit + m.cod + m.tunaiTransfer;
    return acc;
  },
  { cash: 0, kredit: 0, cod: 0, tunaiTransfer: 0, total: 0 }
);

const rekapData = [
  { name: "CASH", value: transactionTotals.cash, color: "#0F5C4C" },
  { name: "KREDIT", value: transactionTotals.kredit, color: "#F59E0B" },
  { name: "COD", value: transactionTotals.cod, color: "#94A3B8" },
  { name: "TUNAI - TRANSFER", value: transactionTotals.tunaiTransfer, color: "#0EA5E9" },
];

const paidUnpaidData = [
  { name: "Paid", value: 1, color: "#10B981" },
  { name: "Unpaid", value: 0, color: "#E2E8F0" },
];

const dailySales = Array.from({ length: 31 }, (_, i) => {
  const base = [4500000, 5200000, 3900000, 6100000, 4800000, 5500000, 4700000];
  return { day: `${i + 1}`, value: base[i % base.length] };
});
const dailyTotal = dailySales.reduce((s, d) => s + d.value, 0);

// ============ FORMATTER ============

const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const compact = (n) => {
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(1).replace(".", ",")} M`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(".", ",")} jt`;
  if (n >= 1000) return `${Math.round(n / 1000)} rb`;
  return `${n}`;
};

// ============ UI COMPONENTS ============

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
      {subtitle && <p className="text-[12.5px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

function QuickMenuItem({ label, to }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px] font-medium text-slate-700 hover:bg-[#0F5C4C] hover:text-white hover:border-[#0F5C4C] transition-colors"
    >
      {label}
    </Link>
  );
}

function QuickMenu() {
  const groups = [
    {
      title: "Booking",
      icon: CalendarDaysIcon,
      items: [
        { label: "BOOKING / PICKUP", to: "/bookings" },
        { label: "INBOUND BOOKING", to: "/bookings" },
      ],
    },
    {
      title: "Transaction",
      icon: ArrowPathIcon,
      items: [
        { label: "ADD ON SITE", to: "/transactions" },
        { label: "LIST AWB", to: "/transactions" },
        { label: "SHIPMENT STATUS", to: "/shipment-status" },
      ],
    },
    {
      title: "Manifest",
      icon: ClipboardDocumentListIcon,
      items: [
        { label: "ADD MANIFEST", to: "/operations" },
        { label: "PRINT MANIFEST", to: "/operations" },
        { label: "TRANSIT MANIFEST", to: "/operations" },
        { label: "INBOUND MANIFEST", to: "/operations" },
      ],
    },
    {
      title: "Delivery Sheet",
      icon: TruckIcon,
      items: [
        { label: "ADD DRS", to: "/operations" },
        { label: "PRINT DRS", to: "/operations" },
      ],
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-slate-800">Menu Cepat</h3>
        <Link to="/" className="text-[12.5px] text-[#0F5C4C] font-medium hover:underline">
          Dashboard
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((g) => (
          <div key={g.title} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-lg bg-[#0F5C4C]/10 text-[#0F5C4C] flex items-center justify-center">
                <g.icon className="w-[18px] h-[18px]" />
              </span>
              <span className="text-[13.5px] font-semibold text-slate-800">{g.title}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <QuickMenuItem key={item.label} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ title, subtitle, value, footer, icon: Icon, valueClass = "text-2xl" }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-500 leading-tight">{title}</p>
          {subtitle && <p className="text-[11.5px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <span className="w-9 h-9 rounded-lg bg-[#0F5C4C]/10 text-[#0F5C4C] flex items-center justify-center shrink-0">
          <Icon className="w-[18px] h-[18px]" />
        </span>
      </div>
      <div>
        <p className={`font-bold text-slate-900 ${valueClass}`}>{value}</p>
      </div>
      {footer && (
        <Link to={footer.to || "#"} className="inline-flex items-center gap-1 text-[12.5px] text-[#0F5C4C] font-medium hover:underline">
          {footer.label}
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

function LegendRow({ color, label, value }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="flex items-center gap-2 text-[12.5px] text-slate-600">
        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="text-[12.5px] font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function DonutWithCenter({ data, centerTitle, centerValue }) {
  return (
    <div className="relative h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={72}
            outerRadius={100}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => rupiah(value)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[11px] text-slate-400">{centerTitle}</span>
        <span className="text-xl font-bold text-slate-900 mt-0.5">{centerValue}</span>
      </div>
    </div>
  );
}

// ============ DASHBOARD ============

export default function Dashboard() {
  const cabangCards = [
    {
      title: "Omset Bulan Ini",
      subtitle: "Total Cash",
      value: rupiah(0),
      icon: BanknotesIcon,
      footer: { label: "Lihat Selengkapnya", to: "/akunting" },
    },
    {
      title: "Omset Bulan Ini",
      subtitle: "Total Kredit",
      value: rupiah(0),
      icon: CreditCardIcon,
      footer: { label: "Lihat Selengkapnya", to: "/akunting" },
    },
    {
      title: "Total Piutang",
      subtitle: "Total Piutang",
      value: rupiah(0),
      icon: ReceiptPercentIcon,
      footer: { label: "Lihat Selengkapnya", to: "/akunting" },
    },
    {
      title: "Penjualan Bulan Ini",
      subtitle: "Total",
      value: rupiah(0),
      icon: ShoppingCartIcon,
      footer: { label: "Lihat Selengkapnya", to: "/transactions" },
    },
    {
      title: "AWB Uninvoice Bulan Ini",
      subtitle: "11 AWB",
      value: rupiah(0),
      icon: DocumentTextIcon,
      valueClass: "text-xl",
      footer: { label: "Lihat Selengkapnya", to: "/transactions" },
    },
    {
      title: "AWB Invoiced Bulan Ini",
      subtitle: "0 AWB",
      value: rupiah(0),
      icon: CheckBadgeIcon,
      valueClass: "text-xl",
      footer: { label: "Lihat Selengkapnya", to: "/transactions" },
    },
  ];

  const operasionalCards = [
    { title: "AWB Belum Termanifest", value: "11 AWB", icon: ClipboardDocumentListIcon },
    { title: "AWB Belum Inbound", value: "0 AWB", icon: ArrowDownTrayIcon },
    { title: "AWB Belum Masuk DRS", value: "11 AWB", icon: TruckIcon },
    { title: "POD Kembali Tujuan", value: "0 AWB", icon: ArrowRightIcon },
    { title: "POD Kembali Asal", value: "0 AWB", icon: ArrowLeftIcon },
  ];

  const chartTooltipStyle = {
    backgroundColor: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    fontSize: "12.5px",
    boxShadow: "0 8px 24px -8px rgba(15,23,42,0.15)",
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-[13px] text-slate-400 mt-0.5">Ringkasan aktivitas cabang & operasional</p>
      </div>

      {/* Menu Cepat */}
      <QuickMenu />

      {/* Dashboard Admin Cabang */}
      <section>
        <SectionTitle title="Dashboard Admin Cabang" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cabangCards.map((c) => (
            <StatCard key={c.title + c.subtitle} {...c} />
          ))}
        </div>
      </section>

      {/* Dashboard Operasional */}
      <section>
        <SectionTitle title="Dashboard Operasional" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {operasionalCards.map((c) => (
            <StatCard key={c.title} {...c} footer={{ label: "Lihat Selengkapnya", to: "/operations" }} />
          ))}
        </div>
      </section>

      {/* Grafik Transaksi Per Bulan */}
      <section className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h3 className="text-[15px] font-semibold text-slate-800">Grafik Transaksi Per Bulan</h3>
          <div className="text-right">
            <span className="block text-[11px] text-slate-400">TOTAL</span>
            <span className="text-lg font-bold text-slate-900">{rupiah(transactionTotals.total)}</span>
          </div>
        </div>

        <div className="h-[300px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transactionMonthly} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis
                tickFormatter={compact}
                tick={{ fontSize: 12, fill: "#64748B" }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip formatter={(value) => rupiah(value)} contentStyle={chartTooltipStyle} />
              <Bar dataKey="cash" name="CASH" stackId="a" fill="#0F5C4C" />
              <Bar dataKey="kredit" name="KREDIT" stackId="a" fill="#F59E0B" />
              <Bar dataKey="cod" name="COD" stackId="a" fill="#94A3B8" />
              <Bar dataKey="tunaiTransfer" name="TUNAI - TRANSFER" stackId="a" fill="#0EA5E9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
          <LegendRow color="#0F5C4C" label="CASH" value={rupiah(transactionTotals.cash)} />
          <LegendRow color="#F59E0B" label="KREDIT" value={rupiah(transactionTotals.kredit)} />
          <LegendRow color="#94A3B8" label="COD" value={rupiah(transactionTotals.cod)} />
          <LegendRow color="#0EA5E9" label="TUNAI - TRANSFER" value={rupiah(transactionTotals.tunaiTransfer)} />
        </div>
      </section>

      {/* Rekap Penjualan + Paid Unpaid Invoice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[15px] font-semibold text-slate-800 mb-2">Rekap Penjualan Per Bulan</h3>
          <DonutWithCenter
            data={rekapData}
            centerTitle="TOTAL"
            centerValue={compact(transactionTotals.total)}
          />
          <div className="mt-2 pt-3 border-t border-slate-100">
            {rekapData.map((d) => (
              <LegendRow key={d.name} color={d.color} label={d.name} value={rupiah(d.value)} />
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-[15px] font-semibold text-slate-800 mb-2">Paid Unpaid Invoice</h3>
          <DonutWithCenter
            data={paidUnpaidData}
            centerTitle="TOTAL"
            centerValue={`${paidUnpaidData.reduce((s, d) => s + d.value, 0)} Invoice`}
          />
          <div className="mt-2 pt-3 border-t border-slate-100">
            <LegendRow color="#10B981" label="PAID" value={`${paidUnpaidData[0].value} Invoice`} />
            <LegendRow color="#E2E8F0" label="UNPAID" value={`${paidUnpaidData[1].value} Invoice`} />
          </div>
        </section>

        {/* Grafik Penjualan Harian */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 lg:row-span-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[15px] font-semibold text-slate-800">Grafik Penjualan Harian</h3>
            <div className="text-right">
              <span className="block text-[11px] text-slate-400">TOTAL</span>
              <span className="text-lg font-bold text-slate-900">{rupiah(dailyTotal)}</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales}>
                <defs>
                  <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F5C4C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0F5C4C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF2F7" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  interval={4}
                />
                <YAxis
                  tickFormatter={compact}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip
                  formatter={(value) => rupiah(value)}
                  labelFormatter={(label) => `Tanggal ${label}`}
                  contentStyle={chartTooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Penjualan"
                  stroke="#0F5C4C"
                  strokeWidth={2}
                  fill="url(#dailyFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Footer note data sementara */}
      <p className="text-[12px] text-slate-400 flex items-center gap-1.5">
        <CubeIcon className="w-4 h-4" />
        Data pada halaman ini masih berupa data sementara (mock), akan disambungkan ke API berikutnya.
      </p>
    </div>
  );
}
