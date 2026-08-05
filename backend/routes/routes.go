package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetUpRoutes(r *gin.Engine) {
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	api := r.Group("/api")
	{
		// #auth — endpoint publik (tanpa token)
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
			auth.POST("/refresh", controllers.Refresh)
			auth.POST("/logout", controllers.Logout)
			auth.GET("/me", middleware.AuthMiddleware(), controllers.Me)
		}

		// semua route di bawah ini wajib login (Bearer access token)
		api.Use(middleware.AuthMiddleware())

		vendors := api.Group("/vendors")
		{
			vendors.GET("", controllers.GetVendors)
			vendors.GET("/:id", controllers.GetVendor)
			vendors.POST("", controllers.CreateVendor)
			vendors.PUT("/:id", controllers.UpdateVendor)
			vendors.DELETE("/:id", controllers.DeleteVendor)
		}

		api.GET("/branches", controllers.GetBranches)

		// #office (perusahaan, kantor cabang, agen)
		companies := api.Group("/companies")
		{
			companies.GET("", controllers.GetAllCompanies)
			companies.GET("/:companyId", controllers.GetCompanyByID)
			companies.POST("", controllers.CreateCompany)
			companies.PUT("/:companyId", controllers.UpdateCompany)
			companies.DELETE("/:companyId", controllers.DeleteCompany)

			// pengaturan perusahaan (tanda tangan invoice, data bank,
			// dompet digital, notifikasi WA)
			companies.GET("/:companyId/invoices", controllers.GetCompanyInvoices)
			companies.POST("/:companyId/invoices", controllers.CreateCompanyInvoice)
			companies.PUT("/:companyId/invoices/:id", controllers.UpdateCompanyInvoice)
			companies.DELETE("/:companyId/invoices/:id", controllers.DeleteCompanyInvoice)

			companies.GET("/:companyId/banks", controllers.GetCompanyBanks)
			companies.POST("/:companyId/banks", controllers.CreateCompanyBank)
			companies.PUT("/:companyId/banks/:id", controllers.UpdateCompanyBank)
			companies.DELETE("/:companyId/banks/:id", controllers.DeleteCompanyBank)

			companies.GET("/:companyId/wallets", controllers.GetCompanyDigitalWallets)
			companies.POST("/:companyId/wallets", controllers.CreateCompanyDigitalWallet)
			companies.PUT("/:companyId/wallets/:id", controllers.UpdateCompanyDigitalWallet)
			companies.DELETE("/:companyId/wallets/:id", controllers.DeleteCompanyDigitalWallet)

			companies.GET("/:companyId/whatsapp-notifications", controllers.GetCompanyWhatsappNotifications)
			companies.POST("/:companyId/whatsapp-notifications", controllers.CreateCompanyWhatsappNotification)
			companies.PUT("/:companyId/whatsapp-notifications/:id", controllers.UpdateCompanyWhatsappNotification)
			companies.DELETE("/:companyId/whatsapp-notifications/:id", controllers.DeleteCompanyWhatsappNotification)
		}

		offices := api.Group("/offices")
		{
			offices.GET("", controllers.GetAllOffices)
			offices.GET("/:id", controllers.GetOfficeByID)
			offices.POST("", controllers.CreateOffice)
			offices.PUT("/:id", controllers.UpdateOffice)
			offices.DELETE("/:id", controllers.DeleteOffice)
		}

		officeBranches := api.Group("/office-branches")
		{
			officeBranches.GET("", controllers.GetAllBranches)
			officeBranches.GET("/:id", controllers.GetBranchByID)
			officeBranches.POST("", controllers.CreateBranch)
			officeBranches.PUT("/:id", controllers.UpdateBranch)
			officeBranches.DELETE("/:id", controllers.DeleteBranch)
		}

		agents := api.Group("/agents")
		{
			agents.GET("", controllers.GetAllAgents)
			agents.GET("/:id", controllers.GetAgentByID)
			agents.POST("", controllers.CreateAgent)
			agents.PUT("/:id", controllers.UpdateAgent)
			agents.DELETE("/:id", controllers.DeleteAgent)
		}

		departments := api.Group("/departments")
		{
			departments.GET("", controllers.GetAllDepartments)
			departments.GET("/:id", controllers.GetDepartmentByID)
			departments.POST("", controllers.CreateDepartment)
			departments.PUT("/:id", controllers.UpdateDepartment)
			departments.DELETE("/:id", controllers.DeleteDepartment)
		}

		// #shipmentstatus
		shipmentStatuses := api.Group("/shipment-statuses")
		{
			shipmentStatuses.GET("", controllers.GetShipmentStatuses)
			shipmentStatuses.POST("", controllers.CreateShipmentStatus)
			shipmentStatuses.PUT("/:id", controllers.UpdateShipmentStatus)
			shipmentStatuses.DELETE("/:id", controllers.DeleteShipmentStatus)
		}

		perkiraan := api.Group("/perkiraan")
		{
			perkiraan.GET("", controllers.GetAccountsList)
			perkiraan.GET("/:id", controllers.GetAccount)
			perkiraan.POST("", controllers.CreateAccount)
			perkiraan.PUT("/:id", controllers.UpdateAccount)
			perkiraan.DELETE("/:id", controllers.DeleteAccount)
		}

		ledgers := api.Group("/ledgers")
		{
			ledgers.GET("", controllers.GetLedgers)
			ledgers.POST("", controllers.CreateLedger)
			ledgers.PUT("/:id", controllers.UpdateLedger)
			ledgers.DELETE("/:id", controllers.DeleteLedger)
		}

		accountCategories := api.Group("/account-categories")
		{
			accountCategories.GET("", controllers.GetAccountCategories)
			accountCategories.POST("", controllers.CreateAccountCategory)
			accountCategories.PUT("/:id", controllers.UpdateAccountCategory)
			accountCategories.DELETE("/:id", controllers.DeleteAccountCategory)
		}

		profitLosses := api.Group("/profit-loss")
		{
			profitLosses.GET("", controllers.GetProfitLossCategories)
			profitLosses.POST("", controllers.CreateProfitLossCategory)
			profitLosses.PUT("/:id", controllers.UpdateProfitLossCategory)
			profitLosses.DELETE("/:id", controllers.DeleteProfitLossCategory)
		}

		cashflows := api.Group("/cashflows")
		{
			cashflows.GET("", controllers.GetCashflowCategories)
			cashflows.POST("", controllers.CreateCashflowCategory)
			cashflows.PUT("/:id", controllers.UpdateCashflowCategory)
			cashflows.DELETE("/:id", controllers.DeleteCashflowCategory)
		}

		// #area
		provinces := api.Group("/provinces")
		{
			provinces.GET("", controllers.GetProvinces)
			provinces.POST("", controllers.CreateProvince)
			provinces.PUT("/:id", controllers.UpdateProvince)
			provinces.DELETE("/:id", controllers.DeleteProvince)
		}

		regencies := api.Group("/regencies")
		{
			regencies.GET("", controllers.GetRegencies)
			regencies.POST("", controllers.CreateRegency)
			regencies.PUT("/:id", controllers.UpdateRegency)
			regencies.DELETE("/:id", controllers.DeleteRegency)
		}

		districts := api.Group("/districts")
		{
			districts.GET("", controllers.GetDistricts)
			districts.POST("", controllers.CreateDistrict)
			districts.PUT("/:id", controllers.UpdateDistrict)
			districts.DELETE("/:id", controllers.DeleteDistrict)
		}

		villages := api.Group("/villages")
		{
			villages.GET("", controllers.GetVillages)
			villages.POST("", controllers.CreateVillage)
			villages.PUT("/:id", controllers.UpdateVillage)
			villages.DELETE("/:id", controllers.DeleteVillage)
		}

		postalCodes := api.Group("/postal-codes")
		{
			postalCodes.GET("", controllers.GetPostalCodes)
			postalCodes.POST("", controllers.CreatePostalCode)
			postalCodes.PUT("/:id", controllers.UpdatePostalCode)
			postalCodes.DELETE("/:id", controllers.DeletePostalCode)
		}

		// #division
		marketing := api.Group("/marketing")
		{
			marketing.GET("", controllers.GetMarketings)
			marketing.POST("", controllers.CreateMarketing)
			marketing.PUT("/:id", controllers.UpdateMarketing)
			marketing.DELETE("/:id", controllers.DeleteMarketing)
		}

		drivers := api.Group("/drivers")
		{
			drivers.GET("", controllers.GetDrivers)
			drivers.POST("", controllers.CreateDriver)
			drivers.PUT("/:id", controllers.UpdateDriver)
			drivers.DELETE("/:id", controllers.DeleteDriver)
		}

		couriers := api.Group("/couriers")
		{
			couriers.GET("", controllers.GetCouriers)
			couriers.POST("", controllers.CreateCourier)
			couriers.PUT("/:id", controllers.UpdateCourier)
			couriers.DELETE("/:id", controllers.DeleteCourier)
		}

		// #services
		modes := api.Group("/modes")
		{
			modes.GET("", controllers.GetModes)
			modes.POST("", controllers.CreateMode)
			modes.PUT("/:id", controllers.UpdateMode)
			modes.DELETE("/:id", controllers.DeleteMode)
		}

		serviceCategories := api.Group("/service-categories")
		{
			serviceCategories.GET("", controllers.GetServiceCategories)
			serviceCategories.POST("", controllers.CreateServiceCategory)
			serviceCategories.PUT("/:id", controllers.UpdateServiceCategory)
			serviceCategories.DELETE("/:id", controllers.DeleteServiceCategory)
		}

		deliveryServices := api.Group("/delivery-services")
		{
			deliveryServices.GET("", controllers.GetDeliveryServices)
			deliveryServices.POST("", controllers.CreateDeliveryService)
			deliveryServices.PUT("/:id", controllers.UpdateDeliveryService)
			deliveryServices.DELETE("/:id", controllers.DeleteDeliveryService)
		}

		goodsTypes := api.Group("/goods-types")
		{
			goodsTypes.GET("", controllers.GetGoodsTypes)
			goodsTypes.POST("", controllers.CreateGoodsType)
			goodsTypes.PUT("/:id", controllers.UpdateGoodsType)
			goodsTypes.DELETE("/:id", controllers.DeleteGoodsType)
		}

		costTypes := api.Group("/cost-types")
		{
			costTypes.GET("", controllers.GetCostTypes)
			costTypes.POST("", controllers.CreateCostType)
			costTypes.PUT("/:id", controllers.UpdateCostType)
			costTypes.DELETE("/:id", controllers.DeleteCostType)
		}

		terms := api.Group("/terms")
		{
			terms.GET("", controllers.GetTerms)
			terms.POST("", controllers.CreateTerm)
			terms.PUT("/:id", controllers.UpdateTerm)
			terms.DELETE("/:id", controllers.DeleteTerm)
		}

		// #vehicles
		vehicles := api.Group("/vehicles")
		{
			vehicles.GET("", controllers.GetVehicles)
			vehicles.POST("", controllers.CreateVehicle)
			vehicles.PUT("/:id", controllers.UpdateVehicle)
			vehicles.DELETE("/:id", controllers.DeleteVehicle)
		}

		vehicleTypes := api.Group("/vehicle-types")
		{
			vehicleTypes.GET("", controllers.GetVehicleTypes)
			vehicleTypes.POST("", controllers.CreateVehicleType)
			vehicleTypes.PUT("/:id", controllers.UpdateVehicleType)
			vehicleTypes.DELETE("/:id", controllers.DeleteVehicleType)
		}

		truckingTypes := api.Group("/trucking-types")
		{
			truckingTypes.GET("", controllers.GetTruckingTypes)
			truckingTypes.POST("", controllers.CreateTruckingType)
			truckingTypes.PUT("/:id", controllers.UpdateTruckingType)
			truckingTypes.DELETE("/:id", controllers.DeleteTruckingType)
		}
	}
}
