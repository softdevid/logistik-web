package hr

import (
	"backend/models"
	"backend/models/company"
	"time"
)

type Driver struct {
	DriverID                int64 `gorm:"primaryKey"`
	BranchID                *int64
	DepartmentID            *int64
	DriverCode              string
	FullName                string
	NationalID              *string
	PhoneNumber             *string
	Address                 *string
	DriverLicenseNumber     *string
	DriverLicenseExpiryDate *time.Time
	IsActive                bool

	Branch     company.Branch
	Department models.Department

	BaseModel models.BaseModel `gorm:"embedded"`
}

func (Driver) TableName() string {
	return "drivers"
}
