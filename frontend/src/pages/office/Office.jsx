import CrudTab from "../../components/CrudTab";
import WhatsAppMessageModal from "../../components/WhatsAppMessageModal";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

const ACTIVE = {
  key: "IsActive",
  label: "Aktif",
  type: "checkbox",
  default: true,
  checkLabel: "Aktif",
  table: true,
};

const COMPANY_PARENT = {
  label: "Perusahaan",
  fetch: "companies",
  fetchId: "CompanyID",
  fetchLabel: "CompanyName",
};

const companyFields = [
  { key: "CompanyName", label: "Nama Perusahaan", type: "text", required: true, table: true },
  { key: "Address", label: "Alamat", type: "text", table: true },
  { key: "City", label: "Kota", type: "text", table: true },
  { key: "PostalCode", label: "Kode Pos", type: "text" },
  { key: "PhoneNumber", label: "No. Telepon", type: "text", table: true },
  { key: "FaxNumber", label: "No. Fax", type: "text" },
  { key: "DirectorName", label: "Nama Direktur", type: "text" },
  { key: "TaxID", label: "NPWP", type: "text", table: true },
  { key: "Website", label: "Website", type: "text" },
  { key: "Email", label: "Email", type: "text", table: true },
  { key: "IsDepositAgent", label: "Agen Deposit", type: "checkbox", default: false, checkLabel: "Agen Deposit", table: true },
  { key: "ShowPriceOnPrint", label: "Tampilkan Harga di Cetakan", type: "checkbox", default: false, checkLabel: "Tampilkan harga di cetakan" },
  { key: "Logo", label: "Logo", type: "text" },
];

const config = {
  title: "Kantor",
  tabs: [
    {
      label: "Perusahaan",
      tabs: [
        {
          label: "Data Perusahaan",
          endpoint: "companies",
          idKey: "CompanyID",
          fields: companyFields,
        },
        {
          label: "Tanda Tangan Invoice",
          parentField: COMPANY_PARENT,
          endpoint: "companies/{parent}/invoices",
          idKey: "CompanyInvoiceID",
          fields: [
            { key: "InvoiceFormat", label: "Format Invoice", type: "text", table: true },
            { key: "SignatoryName", label: "Nama Penandatangan", type: "text", table: true },
            { key: "SignatoryPosition", label: "Jabatan", type: "text", table: true },
            { key: "InvoiceMessage", label: "Pesan Invoice", type: "text" },
          ],
        },
        {
          label: "Data Bank",
          parentField: COMPANY_PARENT,
          endpoint: "companies/{parent}/banks",
          idKey: "CompanyBankID",
          fields: [
            { key: "BankDescription", label: "Deskripsi Bank", type: "text", required: true, table: true },
          ],
        },
        {
          label: "Dompet Digital",
          parentField: COMPANY_PARENT,
          endpoint: "companies/{parent}/wallets",
          idKey: "CompanyDigitalWalletID",
          fields: [
            { key: "WalletProvider", label: "Penyedia", type: "text", table: true },
            { key: "AccountName", label: "Nama Akun", type: "text", table: true },
            { key: "AccountNumber", label: "No. Akun", type: "text", table: true },
            { key: "VerificationEmail", label: "Email Verifikasi", type: "text" },
          ],
        },
        {
          label: "WA Notifikasi",
          parentField: COMPANY_PARENT,
          endpoint: "companies/{parent}/whatsapp-notifications",
          idKey: "CustomerWhatsappNotificationID",
          fields: [
            { key: "CustomerID", label: "ID Customer", type: "number", table: true },
            { key: "IsEnabled", label: "Aktif", type: "checkbox", default: true, checkLabel: "Aktif", table: true },
          ],
          actions: [
            {
              label: "Lihat Pesan WhatsApp",
              icon: ChatBubbleLeftRightIcon,
              Modal: WhatsAppMessageModal,
            },
          ],
        },
      ],
    },
    {
      label: "Kantor",
      endpoint: "offices",
      idKey: "OfficeID",
      fields: [
        { key: "OfficeCode", label: "Kode Kantor", type: "text", required: true, table: true },
        { key: "OfficeName", label: "Nama Kantor", type: "text", required: true, table: true },
        { key: "CompanyID", label: "Perusahaan", type: "select", required: true,
          fetch: "companies", fetchId: "CompanyID", fetchLabel: "CompanyName", table: true },
        { key: "Address", label: "Alamat", type: "text", table: true },
        { key: "City", label: "Kota", type: "text", table: true },
        { key: "PhoneNumber", label: "No. Telepon", type: "text", table: true },
        { key: "Email", label: "Email", type: "text" },
        { key: "OfficeManager", label: "Manager Kantor", type: "text" },
        ACTIVE,
      ],
    },
    {
      label: "Kantor Cabang",
      endpoint: "office-branches",
      idKey: "BranchID",
      fields: [
        { key: "BranchCode", label: "Kode Cabang", type: "text", required: true, table: true },
        { key: "BranchName", label: "Nama Cabang", type: "text", required: true, table: true },
        { key: "OfficeID", label: "Kantor", type: "select", required: true,
          fetch: "offices", fetchId: "OfficeID", fetchLabel: "OfficeName", table: true },
        { key: "Address", label: "Alamat", type: "text", table: true },
        { key: "City", label: "Kota", type: "text" },
        { key: "PhoneNumber", label: "No. Telepon", type: "text", table: true },
        { key: "BranchManager", label: "Manager Cabang", type: "text" },
        { key: "ManagerContact", label: "Kontak Manager", type: "text" },
        ACTIVE,
      ],
    },
    {
      label: "Agen",
      endpoint: "agents",
      idKey: "AgentID",
      fields: [
        { key: "AgentCode", label: "Kode Agen", type: "text", required: true, table: true },
        { key: "AgentInitials", label: "Inisial Agen", type: "text", required: true },
        { key: "AgentName", label: "Nama Agen", type: "text", required: true, table: true },
        { key: "AgentCategory", label: "Kategori Agen", type: "text", table: true },
        { key: "BranchID", label: "Kantor Cabang", type: "select", required: true,
          fetch: "office-branches", fetchId: "BranchID", fetchLabel: "BranchName", table: true },
        { key: "DepartmentID", label: "Departemen", type: "select",
          fetch: "departments", fetchId: "DepartmentID", fetchLabel: "DepartmentName" },
        { key: "PhoneNumber", label: "No. Telepon", type: "text" },
        { key: "AgentManager", label: "Manager Agen", type: "text" },
        { key: "MobileNumber", label: "No. Handphone", type: "text" },
        { key: "Balance", label: "Saldo", type: "number", table: true },
        { key: "CommissionRate", label: "Komisi (%)", type: "number" },
        ACTIVE,
      ],
    },
  ],
};

export default function Office() {
  return <CrudTab config={config} />;
}
