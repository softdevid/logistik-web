package models

// Accounting = tab "Accounting", one-to-one dengan Vendor
type Accounting struct {
	ID       uint `gorm:"primaryKey" json:"id"`
	VendorID uint `gorm:"not null;uniqueIndex" json:"vendor_id"` // uniqueIndex = tegakkan one-to-one

	DebitAccountID uint    `gorm:"not null;index" json:"debit_account_id"`
	DebitAccount   Account `gorm:"foreignKey:DebitAccountID" json:"debit_account,omitempty"`

	CreditHutangAccountID uint    `gorm:"not null;index" json:"credit_hutang_account_id"`
	CreditHutangAccount   Account `gorm:"foreignKey:CreditHutangAccountID" json:"credit_hutang_account,omitempty"`

	CreditPendapatanAccountID uint    `gorm:"not null;index" json:"credit_pendapatan_account_id"`
	CreditPendapatanAccount   Account `gorm:"foreignKey:CreditPendapatanAccountID" json:"credit_pendapatan_account,omitempty"`

	BagiHasilPercent float64 `gorm:"type:decimal(5,2);default:0" json:"bagi_hasil_percent"`
	KomisiPercent    float64 `gorm:"type:decimal(5,2);default:0" json:"komisi_percent"`
}
