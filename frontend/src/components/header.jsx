import { useState, useRef, useEffect } from "react";
import {
  HomeIcon,
  TruckIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";


const MENU = [
  { name: "Dashboard", link: "/", icon: HomeIcon },
  {
    name: "Pengiriman",
    icon: TruckIcon,
    children: [
      { name: "Semua Pengiriman", link: "/pengiriman" },
      { name: "Dalam Perjalanan", link: "/pengiriman/perjalanan" },
      { name: "Terkirim", link: "/pengiriman/terkirim" },
    ],
  },
];

function Chevron({ open }) {
  return (
    <ChevronDownIcon
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    />
  );
}

function MenuItem({ item }) {
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

  if (!hasChildren) {
    return (
      <a
        href={item.link}
        className="group flex items-center gap-2 px-3.5 py-2 rounded-lg text-[14px] font-medium text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
      >
        {Icon && (
          <Icon className="w-[18px] h-[18px] text-slate-400 group-hover:text-[#0F5C4C] transition-colors" />
        )}
        {item.name}
      </a>
    );
  }

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
            <a
              key={child.name}
              href={child.link}
              className="flex items-center px-4 py-2.5 text-[13.5px] text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
            >
              {child.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="px-6 lg:px-8 h-[68px] flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#0F5C4C] flex items-center justify-center">
            <TruckIcon className="w-[18px] h-[18px] text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
            Logistik-Web
          </h1>
        </div>

        {/* Menu, mendukung turunan/submenu */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {MENU.map((item) => (
            <MenuItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Profil */}
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
              <a
                href="/profil"
                className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
              >
                <UserCircleIcon className="w-4 h-4" />
                Profil Saya
              </a>
              <a
                href="/pengaturan"
                className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-slate-600 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                Pengaturan
              </a>
              <div className="my-1 border-t border-slate-100" />
              <a
                href="/logout"
                className="flex items-center gap-2 px-4 py-2.5 text-[13.5px] text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Keluar
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}