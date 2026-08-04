package company

import "backend/models"

type Branch struct {
	BranchID       int64 `gorm:"primaryKey"`
	OfficeID       int64
	BranchCode     string
	BranchName     string
	Address        *string
	City           *string
	PhoneNumber    *string
	BranchManager  *string
	ManagerContact *string
	IsActive       bool

	Office Office

	BaseModel models.BaseModel `gorm:"embedded"`
}

func (Branch) TableName() string {
	return "branches"
}
