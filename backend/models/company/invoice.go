package company

import "time"

type CompanyInvoice struct {
	CompanyInvoiceID  int64     `gorm:"column:company_invoice_id;primaryKey"`
	CompanyID         int64     `gorm:"column:company_id;not null"`
	InvoiceFormat     *string   `gorm:"column:invoice_format"`
	SignatoryName     *string   `gorm:"column:signatory_name"`
	SignatoryPosition *string   `gorm:"column:signatory_position"`
	InvoiceMessage    *string   `gorm:"column:invoice_message"`
	CreatedAt         time.Time `gorm:"column:created_at"`
	UpdatedAt         time.Time `gorm:"column:updated_at"`
}

func (CompanyInvoice) TableName() string {
	return "company_invoices"
}
