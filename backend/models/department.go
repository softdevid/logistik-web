package models

type Department struct {
	DepartmentID   int64 `gorm:"primaryKey"`
	DepartmentCode string
	DepartmentName string
	IsActive       bool

	BaseModel BaseModel `gorm:"embedded"`
}

func (Department) TableName() string {
	return "departments"
}
