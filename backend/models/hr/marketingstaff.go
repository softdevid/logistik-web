package hr

import (
	"backend/models"
	"backend/models/company"
)

type MarketingStaff struct {
	MarketingStaffID int64 `gorm:"primaryKey"`
	BranchID         *int64
	DepartmentID     *int64
	MarketingCode    string
	FullName         string
	NationalID       *string
	PhoneNumber      *string
	Address          *string
	Email            *string
	IsActive         bool

	Branch     company.Branch
	Department models.Department

	BaseModel models.BaseModel `gorm:"embedded"`
}

func (MarketingStaff) TableName() string {
	return "marketing_staff"
}
