import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon,
  ListBulletIcon,
  FolderOpenIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";


const MENU = [
  { name: "Dashboard", link: "/", icon: HomeIcon },
  {
    name: "Sistem Setting",
    icon: Cog6ToothIcon,
    children: [
      { name: "Grup User", link: "/group-user" },
      { name: "Manajemen User", link: "/user-management" },
      { name: "Hak Akses Menu", link: "/hak-akses-menu" },
    ],
  },
  {
    name: "Kantor",
    icon: BuildingStorefrontIcon,
    children: [
      { name: "Perusahaan", link: "/company" },
      { name: "Kantor Cabang", link: "/branch-offices" },
    ],
  },
  {
    name: "Master Data",
    icon: ListBulletIcon,
    children: [
      { name: "Logistik",
        children: [
          { name: "Area Logistik", link: "/logistics/areas" },
          { name: "Divisi Logistik", link: "/logistics/division" },
          { name: "Layanan Logistik", link: "/logistics/services" },
          { name: "Kendaraan Logistik", link: "/logistics/vehicles" },
        ]
      },
      { name: "Vendor", link: "/vendor" },
      { name: "Perkiraan", link: "/perkiraan" },
      { name: "Shipment Status", link: "/shipment-status" },
    ],
  },
  {
    name: "Akunting",
    icon: ChartBarIcon,
    link: "/akunting",
  },
  {
    name: "Modul",
    icon: FolderOpenIcon,
    children: [
      { name: "Pemasaran/Penjualan", link: "/marketing" },
      { name: "Layanan Pelanggan", children: [
        { name: "Transaksi", link: "/transactions" },
        { name: "Booking", link: "/bookings" },
      ]},
      { name: "Operasional", link: "/operations" },
    ],
  },
  {
    name: "Laporan",
    icon: ChartBarIcon,
    children: [
      { name: "Laporan Cabang", link: "/branch-reports" },
      { name: "Laporan Kurir", link: "/courier-reports" },
      { name: "Laporan Keuangan", link: "/financial-reports" },
      { name: "Customer Reports", link: "/customer-reports" },
    ],
  },
  {
    name: "Ticketing",
    icon: TicketIcon,
    link: "/ticketting",
  },
];


function Chevron({ open, className = "" }) {
  return (
    <ChevronDownIcon
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""} ${className}`}
    />
  );
}

function MobileMenuItem({ item, depth = 0, onNavigate }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const Icon = item.icon;

  function handleClick() {
    if (onNavigate) onNavigate();
  }

  if (!hasChildren) {
    return (
      <Link
        to={item.link}
        onClick={handleClick}
        className={`flex items-center gap-2.5 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0F5C4C] transition-colors ${
          depth === 0 ? "px-3" : "pl-10 pr-3"
        }`}
      >
        {depth === 0 && Icon && (
          <Icon className="w-[18px] h-[18px] text-slate-400" />
        )}
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-2.5 py-2.5 text-sm font-medium transition-colors ${
          open ? "text-[#0F5C4C]" : "text-slate-600 hover:text-[#0F5C4C]"
        } ${depth === 0 ? "px-3" : "pl-10 pr-3"}`}
      >
        {depth === 0 && Icon && (
          <Icon className={`w-[18px] h-[18px] ${open ? "text-[#0F5C4C]" : "text-slate-400"}`} />
        )}
        <span className="flex-1 text-left">{item.name}</span>
        {depth === 0 ? (
          <Chevron open={open} />
        ) : (
          <ChevronRightIcon
            className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        )}
      </button>
      {open && (
        <div className="ml-4 border-l border-slate-100">
          {item.children.map((child) => (
            <MobileMenuItem key={child.name} item={child} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopMenuItem({ item, depth = 0, onNavigate }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const ref = useRef(null);
  const Icon = item.icon;

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleClick() {
    setOpen(false);
    if (onNavigate) onNavigate();
  }

  if (!hasChildren) {
    if (depth === 0) {
      return (
        <Link
          to={item.link}
          onClick={handleClick}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-lg text-[14px] font-medium text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
        >
          {Icon && (
            <Icon className="w-[18px] h-[18px] text-slate-400 group-hover:text-[#0F5C4C] transition-colors" />
          )}
          {item.name}
        </Link>
      );
    }

    return (
      <Link
        to={item.link}
        onClick={handleClick}
        className="flex items-center justify-between px-4 py-2.5 text-[13.5px] text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
      >
        {item.name}
      </Link>
    );
  }

  if (depth === 0) {
    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`group flex items-center gap-2 px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors ${
            open ? "text-[#0F5C4C] bg-[#0F5C4C]/[0.06]" : "text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06]"
          }`}
        >
          {Icon && (
            <Icon
              className={`w-[18px] h-[18px] transition-colors ${
                open ? "text-[#0F5C4C]" : "text-slate-400 group-hover:text-[#0F5C4C]"
              }`}
            />
          )}
          {item.name}
          <Chevron open={open} />
        </button>

        {open && (
          <div className="absolute left-0 top-[calc(100%+8px)] min-w-[220px] py-1.5 bg-white rounded-xl border border-slate-200 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)] z-50">
            {item.children.map((child) => (
              <DesktopMenuItem key={child.name} item={child} depth={depth + 1} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-[13.5px] transition-colors ${
          open ? "text-[#0F5C4C] bg-[#0F5C4C]/[0.06]" : "text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06]"
        }`}
      >
        {item.name}
        <ChevronRightIcon
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-[calc(100%+4px)] top-0 min-w-[200px] py-1.5 bg-white rounded-xl border border-slate-200 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)] z-50">
          {item.children.map((child) => (
            <DesktopMenuItem key={child.name} item={child} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="px-4 md:px-6 lg:px-8 h-[60px] md:h-[68px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-20"
            />
          </div>
        </div>

        <div className="relative shrink-0" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border transition-colors ${
              profileOpen ? "border-[#0F5C4C]/30 bg-[#0F5C4C]/[0.06]" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[13px] font-semibold">
              A
            </div>
            <div className="hidden lg:flex flex-col items-start leading-tight">
              <span className="text-[13px] font-semibold text-slate-800">Admin Sistem</span>
              <span className="text-[11px] text-slate-400">Operasional</span>
            </div>
            <Chevron open={profileOpen} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] min-w-[200px] py-1.5 bg-white rounded-xl border border-slate-200 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.18)] z-50">
              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
              >
                <UserCircleIcon className="w-4 h-4" />
                Profil Saya
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <Link
                to="/logout"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Keluar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1 px-6 lg:px-8 h-[50px] border-t border-slate-200">
        {MENU.map((item) => (
          <DesktopMenuItem key={item.name} item={item} onNavigate={() => setProfileOpen(false)} />
        ))}
      </nav>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={closeSidebar} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="px-4 h-[60px] flex items-center justify-between border-b border-slate-200 shrink-0">
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-20"
              />
              <button
                type="button"
                onClick={closeSidebar}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {MENU.map((item) => (
                <MobileMenuItem key={item.name} item={item} onNavigate={closeSidebar} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
