package models

import "time"

// Vendor = tab "Data Vendor"
type Vendor struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Name       string `gorm:"not null" json:"name"`
	Address1   string `gorm:"not null" json:"address1"`
	Address2   string `json:"address2"`
	City       string `gorm:"not null" json:"city"`
	CodePos    string `json:"code_pos"`
	NoHp       string `gorm:"not null" json:"no_hp"`
	Fax        string `json:"fax"`
	Email      string `json:"email"`
	NamaKontak string `gorm:"not null" json:"nama_kontak"`
	Branch     string `json:"branch"` // atau ganti uint + FK ke tabel Branch kalau sudah ada
	Status     string `gorm:"not null;default:Active" json:"status"`

	// Relasi one-to-one ke tab lain
	Npwp       Npwp       `gorm:"foreignKey:VendorID" json:"npwp,omitempty"`
	Accounting Accounting `gorm:"foreignKey:VendorID" json:"accounting,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
