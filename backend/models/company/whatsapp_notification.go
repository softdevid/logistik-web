package company

import "time"

type CustomerWhatsappNotification struct {
	CustomerWhatsappNotificationID int64     `gorm:"column:customer_whatsapp_notification_id;primaryKey"`
	CompanyID                      int64     `gorm:"column:company_id"`
	CustomerID                     *int64    `gorm:"column:customer_id"`
	IsEnabled                      bool      `gorm:"column:is_enabled;default:true"`
	CreatedAt                      time.Time `gorm:"column:created_at"`
}

func (CustomerWhatsappNotification) TableName() string {
	return "customer_whatsapp_notifications"
}
