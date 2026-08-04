package models

import "time"

// ============================================================
// Master pendukung dropdown di form Perkiraan.
// Ini yang datanya variatif & kemungkinan besar di-CRUD sendiri
// oleh user lewat menu Master Data / Akunting > Master.
// ============================================================

// Ledger = grup akun level atas, contoh: "100 | AKTIVA LANCAR"
type Ledger struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Kode string `gorm:"size:20;uniqueIndex;not null" json:"kode"` // 100
	Nama string `gorm:"size:100;not null" json:"nama"`            // AKTIVA LANCAR
}

// AccountCategory = dropdown "Kategori Akun", contoh: "AKTIVA LANCAR/TETAP"
type AccountCategory struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Nama string `gorm:"size:100;not null" json:"nama"`
}

// ProfitLossCategory = dropdown "Rugi Laba", contoh: "Test | TRX LabaRugi"
type ProfitLossCategory struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Kode string `gorm:"size:20" json:"kode"`
	Nama string `gorm:"size:100;not null" json:"nama"`
}

// CashflowCategory = dropdown "Kategori Cashflow" (opsional, boleh kosong)
type CashflowCategory struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Nama string `gorm:"size:100;not null" json:"nama"`
}

// Branch = dropdown "Cabang" (null di Account berarti "Nasional")
type Branch struct {
	ID   uint   `gorm:"primaryKey" json:"id"`
	Kode string `gorm:"size:20;uniqueIndex;not null" json:"kode"`
	Nama string `gorm:"size:100;not null" json:"nama"`
}

// ============================================================
// Konstanta untuk field yang pilihannya tetap/baku (bukan master
// data yang di-CRUD user, cuma kategorisasi standar akuntansi,
// jadi cukup enum/string constrained, tidak perlu tabel sendiri).
// ============================================================

const (
	PosisiNeraca   = "Neraca"
	PosisiRugiLaba = "Rugi Laba"

	NormalBalanceDebet  = "Debet"
	NormalBalanceKredit = "Kredit"

	TampilShow = "Show"
	TampilHide = "Hide"

	JenisKategoriParent = "Parent"
	JenisKategoriChild  = "Child"
)

// ============================================================
// Account = master Chart of Account / "Perkiraan"
// Field mengikuti persis form "Edit Perkiraan".
// ============================================================
type Account struct {
	ID uint `gorm:"primaryKey" json:"id"`

	KodeRekening string `gorm:"size:20;uniqueIndex;not null" json:"kode_rekening"` // 11010000
	InisialAkun  string `gorm:"size:50" json:"inisial_akun"`
	NamaRekening string `gorm:"size:100;not null" json:"nama_rekening"` // KAS/BANK

	// Induk = self-reference, mendukung struktur berjenjang tak terbatas
	IndukID  *uint     `gorm:"index" json:"induk_id"`
	Induk    *Account  `gorm:"foreignKey:IndukID" json:"induk,omitempty"`
	Children []Account `gorm:"foreignKey:IndukID" json:"children,omitempty"`

	LedgerID uint   `gorm:"not null;index" json:"ledger_id"`
	Ledger   Ledger `gorm:"foreignKey:LedgerID" json:"ledger,omitempty"`

	KategoriAkunID uint            `gorm:"not null;index" json:"kategori_akun_id"`
	KategoriAkun   AccountCategory `gorm:"foreignKey:KategoriAkunID" json:"kategori_akun,omitempty"`

	// Enum tetap, lihat konstanta di atas
	Posisi        string `gorm:"size:20;not null" json:"posisi"`         // Neraca / Rugi Laba
	NormalBalance string `gorm:"size:10;not null" json:"normal_balance"` // Debet / Kredit
	Tampil        string `gorm:"size:10;not null;default:Show" json:"tampil"`
	JenisKategori string `gorm:"size:20;not null" json:"jenis_kategori"` // Parent / Child

	RugiLabaID *uint               `gorm:"index" json:"rugi_laba_id"` // nullable, tidak semua akun masuk laba rugi
	RugiLaba   *ProfitLossCategory `gorm:"foreignKey:RugiLabaID" json:"rugi_laba,omitempty"`

	KategoriCashflowID *uint             `gorm:"index" json:"kategori_cashflow_id"` // nullable ("Please Select...")
	KategoriCashflow   *CashflowCategory `gorm:"foreignKey:KategoriCashflowID" json:"kategori_cashflow,omitempty"`

	CabangID *uint   `gorm:"index" json:"cabang_id"` // nullable = Nasional
	Cabang   *Branch `gorm:"foreignKey:CabangID" json:"cabang,omitempty"`

	Status bool `gorm:"not null;default:true" json:"status"` // toggle ON/OFF di form

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
