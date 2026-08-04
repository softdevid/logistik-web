package company

import "backend/models"

type Agent struct {
	AgentID        int64 `gorm:"primaryKey"`
	BranchID       int64
	DepartmentID   *int64
	AgentCode      string
	AgentInitials  string
	AgentName      string
	AgentCategory  string
	PhoneNumber    *string
	AgentManager   *string
	MobileNumber   *string
	Balance        float64
	CommissionRate float64
	IsActive       bool

	Branch     Branch
	Department models.Department

	BaseModel models.BaseModel `gorm:"embedded"`
}

func (Agent) TableName() string {
	return "agents"
}
