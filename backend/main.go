package main

import (
	"time"

	"backend/config"
	"backend/models"
	"backend/models/company"
	"backend/models/hr"
	"backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// konek database dulu sebelum setup routes
	config.ConnectDatabase()
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
		&models.Department{},
		&hr.Driver{},
		&hr.Courier{},
		&hr.MarketingStaff{},
	)

	routes.SetUpRoutes(r)
	r.Run() // default listen di :8080, ini harus paling akhir
}
