package models

// Npwp = tab "NPWP", one-to-one dengan Vendor
type Npwp struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	VendorID uint   `gorm:"not null;uniqueIndex" json:"vendor_id"` // uniqueIndex = tegakkan one-to-one
	NoNpwp   string `gorm:"not null" json:"no_npwp"`
	NamaNpwp string `gorm:"not null" json:"nama_npwp"`
	Address1 string `gorm:"not null" json:"address1"`
	Address2 string `json:"address2"`
	City     string `gorm:"not null" json:"city"`
	CodePos  string `json:"code_pos"`
}
