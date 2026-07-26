package routes

import (
	"backend/controllers"

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
		vendors := api.Group("/vendors")
		{
			vendors.GET("", controllers.GetVendors)
			vendors.GET("/:id", controllers.GetVendor)
			vendors.POST("", controllers.CreateVendor)
			vendors.PUT("/:id", controllers.UpdateVendor)
			vendors.DELETE("/:id", controllers.DeleteVendor)
		}

		api.GET("/cabangs", controllers.GetCabangs)

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
			ledgers.GET("", controllers.GetLedgersAll)
			ledgers.POST("", controllers.CreateLedger)
			ledgers.PUT("/:id", controllers.UpdateLedger)
			ledgers.DELETE("/:id", controllers.DeleteLedger)
		}

		kategoriAkuns := api.Group("/account-categories")
		{
			kategoriAkuns.GET("", controllers.GetKategoriAkunsAll)
			kategoriAkuns.POST("", controllers.CreateKategoriAkun)
			kategoriAkuns.PUT("/:id", controllers.UpdateKategoriAkun)
			kategoriAkuns.DELETE("/:id", controllers.DeleteKategoriAkun)
		}

		rugiLaba := api.Group("/profit-loss")
		{
			rugiLaba.GET("", controllers.GetRugiLabaAll)
			rugiLaba.POST("", controllers.CreateRugiLaba)
			rugiLaba.PUT("/:id", controllers.UpdateRugiLaba)
			rugiLaba.DELETE("/:id", controllers.DeleteRugiLaba)
		}

		cashflows := api.Group("/cashflows")
		{
			cashflows.GET("", controllers.GetCashflowAll)
			cashflows.POST("", controllers.CreateCashflow)
			cashflows.PUT("/:id", controllers.UpdateCashflow)
			cashflows.DELETE("/:id", controllers.DeleteCashflow)
		}

		// #area
		provinces := api.Group("/provinces")
		{
			provinces.GET("", controllers.GetProvinsis)
			provinces.POST("", controllers.CreateProvinsi)
			provinces.PUT("/:id", controllers.UpdateProvinsi)
			provinces.DELETE("/:id", controllers.DeleteProvinsi)
		}

		regencies := api.Group("/regencies")
		{
			regencies.GET("", controllers.GetKabupatens)
			regencies.POST("", controllers.CreateKabupaten)
			regencies.PUT("/:id", controllers.UpdateKabupaten)
			regencies.DELETE("/:id", controllers.DeleteKabupaten)
		}

		districts := api.Group("/districts")
		{
			districts.GET("", controllers.GetKecamatans)
			districts.POST("", controllers.CreateKecamatan)
			districts.PUT("/:id", controllers.UpdateKecamatan)
			districts.DELETE("/:id", controllers.DeleteKecamatan)
		}

		villages := api.Group("/villages")
		{
			villages.GET("", controllers.GetKelurahan)
			villages.POST("", controllers.CreateKelurahan)
			villages.PUT("/:id", controllers.UpdateKelurahan)
			villages.DELETE("/:id", controllers.DeleteKelurahan)
		}

		postalCodes := api.Group("/postal-codes")
		{
			postalCodes.GET("", controllers.GetKodePos)
			postalCodes.POST("", controllers.CreateKodePos)
			postalCodes.PUT("/:id", controllers.UpdateKodePos)
			postalCodes.DELETE("/:id", controllers.DeleteKodePos)
		}

		// #division
		marketing := api.Group("/marketing")
		{
			marketing.GET("", controllers.GetPemasarans)
			marketing.POST("", controllers.CreatePemasaran)
			marketing.PUT("/:id", controllers.UpdatePemasaran)
			marketing.DELETE("/:id", controllers.DeletePemasaran)
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
			couriers.GET("", controllers.GetKurirs)
			couriers.POST("", controllers.CreateKurir)
			couriers.PUT("/:id", controllers.UpdateKurir)
			couriers.DELETE("/:id", controllers.DeleteKurir)
		}

		// #services
		modes := api.Group("/modes")
		{
			modes.GET("", controllers.GetModas)
			modes.POST("", controllers.CreateModa)
			modes.PUT("/:id", controllers.UpdateModa)
			modes.DELETE("/:id", controllers.DeleteModa)
		}

		serviceCategories := api.Group("/service-categories")
		{
			serviceCategories.GET("", controllers.GetKategoriLayanans)
			serviceCategories.POST("", controllers.CreateKategoriLayanan)
			serviceCategories.PUT("/:id", controllers.UpdateKategoriLayanan)
			serviceCategories.DELETE("/:id", controllers.DeleteKategoriLayanan)
		}

		deliveryServices := api.Group("/delivery-services")
		{
			deliveryServices.GET("", controllers.GetLayananPengantarans)
			deliveryServices.POST("", controllers.CreateLayananPengantaran)
			deliveryServices.PUT("/:id", controllers.UpdateLayananPengantaran)
			deliveryServices.DELETE("/:id", controllers.DeleteLayananPengantaran)
		}

		goodsTypes := api.Group("/goods-types")
		{
			goodsTypes.GET("", controllers.GetJenisBarangs)
			goodsTypes.POST("", controllers.CreateJenisBarang)
			goodsTypes.PUT("/:id", controllers.UpdateJenisBarang)
			goodsTypes.DELETE("/:id", controllers.DeleteJenisBarang)
		}

		costTypes := api.Group("/cost-types")
		{
			costTypes.GET("", controllers.GetJenisBiayas)
			costTypes.POST("", controllers.CreateJenisBiaya)
			costTypes.PUT("/:id", controllers.UpdateJenisBiaya)
			costTypes.DELETE("/:id", controllers.DeleteJenisBiaya)
		}

		terms := api.Group("/terms")
		{
			terms.GET("", controllers.GetTermins)
			terms.POST("", controllers.CreateTermin)
			terms.PUT("/:id", controllers.UpdateTermin)
			terms.DELETE("/:id", controllers.DeleteTermin)
		}

		// #vehicles
		vehicles := api.Group("/vehicles")
		{
			vehicles.GET("", controllers.GetKendaraans)
			vehicles.POST("", controllers.CreateKendaraan)
			vehicles.PUT("/:id", controllers.UpdateKendaraan)
			vehicles.DELETE("/:id", controllers.DeleteKendaraan)
		}

		vehicleTypes := api.Group("/vehicle-types")
		{
			vehicleTypes.GET("", controllers.GetJenisKendaraans)
			vehicleTypes.POST("", controllers.CreateJenisKendaraan)
			vehicleTypes.PUT("/:id", controllers.UpdateJenisKendaraan)
			vehicleTypes.DELETE("/:id", controllers.DeleteJenisKendaraan)
		}

		truckingTypes := api.Group("/trucking-types")
		{
			truckingTypes.GET("", controllers.GetJenisTruckings)
			truckingTypes.POST("", controllers.CreateJenisTrucking)
			truckingTypes.PUT("/:id", controllers.UpdateJenisTrucking)
			truckingTypes.DELETE("/:id", controllers.DeleteJenisTrucking)
		}
	}
}
