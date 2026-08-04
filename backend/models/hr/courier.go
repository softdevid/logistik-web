package hr

import (
	"backend/models"
	"backend/models/company"
)

type Courier struct {
	CourierID    int64 `gorm:"primaryKey"`
	BranchID     *int64
	DepartmentID *int64
	CourierCode  string
	FullName     string
	NationalID   *string
	PhoneNumber  *string
	Address      *string
	IsActive     bool

	Branch     company.Branch
	Department models.Department

	BaseModel models.BaseModel `gorm:"embedded"`
}

func (Courier) TableName() string {
	return "couriers"
}
