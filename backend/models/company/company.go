package company

import "backend/models"

type Company struct {
	CompanyID        int64   `gorm:"column:company_id;primaryKey"`
	CompanyName      string  `gorm:"column:company_name"`
	Address          *string `gorm:"column:address"`
	City             *string `gorm:"column:city"`
	PostalCode       *string `gorm:"column:postal_code"`
	PhoneNumber      *string `gorm:"column:phone_number"`
	FaxNumber        *string `gorm:"column:fax_number"`
	DirectorName     *string `gorm:"column:director_name"`
	TaxID            *string `gorm:"column:tax_id"`
	Website          *string `gorm:"column:website"`
	Email            *string `gorm:"column:email"`
	IsDepositAgent   bool    `gorm:"column:is_deposit_agent"`
	ShowPriceOnPrint bool    `gorm:"column:show_price_on_print"`
	Logo             *string `gorm:"column:logo"`

	BaseModel models.BaseModel `gorm:"embedded"`
}

func (Company) TableName() string {
	return "companies"
}
