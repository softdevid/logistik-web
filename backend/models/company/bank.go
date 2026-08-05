package company

import "time"

type CompanyBank struct {
	CompanyBankID   int64     `gorm:"column:company_bank_id;primaryKey"`
	CompanyID       int64     `gorm:"column:company_id;not null"`
	BankDescription *string   `gorm:"column:bank_description"`
	CreatedAt       time.Time `gorm:"column:created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at"`
}

func (CompanyBank) TableName() string {
	return "company_banks"
}
