package main

import (
	"time"

	"backend/config"
	"backend/models"
	"backend/models/company"
	"backend/models/logistics"
	"backend/routes"
	"backend/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	// konek database dulu sebelum setup routes
	config.ConnectDatabase()
	utils.InitJWT()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept", "x-api-key"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	config.DB.AutoMigrate(
		&company.Company{},
		&company.Office{},
		&company.Branch{},
		&company.Agent{},
		&company.CompanyInvoice{},
		&company.CompanyBank{},
		&company.CompanyDigitalWallet{},
		&company.CustomerWhatsappNotification{},
		&models.Department{},
	)

	routes.SetUpRoutes(r)
	config.DB.AutoMigrate(
		&models.User{}, &models.RefreshToken{},
		&models.Vendor{}, &models.Npwp{}, &models.Accounting{},
		&models.Account{}, &models.Ledger{}, &models.AccountCategory{},
		&models.ProfitLossCategory{}, &models.CashflowCategory{}, &models.Branch{},
		&logistics.Province{}, &logistics.Regency{}, &logistics.District{},
		&logistics.Village{}, &logistics.PostalCode{},
		&logistics.Marketing{}, &logistics.Driver{}, &logistics.Courier{},
		&logistics.Mode{}, &logistics.ServiceCategory{}, &logistics.DeliveryService{},
		&logistics.GoodsType{}, &logistics.CostType{}, &logistics.Term{},
		&logistics.Vehicle{}, &logistics.VehicleType{}, &logistics.TruckingType{},
		&logistics.ShipmentStatus{},
	)

	seedAdmin()
	r.Run()
}

// seedAdmin membuat user admin (admin / admin123) jika belum ada.
func seedAdmin() {
	var count int64
	config.DB.Model(&models.User{}).Where("username = ?", "admin").Count(&count)
	if count > 0 {
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		return
	}

	admin := models.User{
		Name:     "Admin Sistem",
		Username: "admin",
		Email:    "admin@logistik.local",
		Password: string(hash),
		Role:     "admin",
		IsActive: true,
	}
	if err := config.DB.Create(&admin).Error; err != nil {
		return
	}
}
