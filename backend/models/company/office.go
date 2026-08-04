package company

import "backend/models"

type Office struct {
	OfficeID      int64 `gorm:"primaryKey"`
	CompanyID     int64
	OfficeCode    string
	OfficeName    string
	Address       *string
	City          *string
	PhoneNumber   *string
	Email         *string
	OfficeManager *string
	IsActive      bool

	Company Company

	BaseModel models.BaseModel `gorm:"embedded"`
}

func (Office) TableName() string {
	return "offices"
}
