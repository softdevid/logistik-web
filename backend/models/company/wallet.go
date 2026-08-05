package company

import "time"

type CompanyDigitalWallet struct {
	CompanyDigitalWalletID int64     `gorm:"column:company_digital_wallet_id;primaryKey"`
	CompanyID              int64     `gorm:"column:company_id;not null"`
	WalletProvider         *string   `gorm:"column:wallet_provider"`
	AccountName            *string   `gorm:"column:account_name"`
	AccountNumber          *string   `gorm:"column:account_number"`
	VerificationEmail      *string   `gorm:"column:verification_email"`
	CreatedAt              time.Time `gorm:"column:created_at"`
	UpdatedAt              time.Time `gorm:"column:updated_at"`
}

func (CompanyDigitalWallet) TableName() string {
	return "company_digital_wallets"
}
