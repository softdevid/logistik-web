package routes

import (
	"github.com/gin-gonic/gin"

	"backend/controllers"
)

func SetUpRoutes(r *gin.Engine) {
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	api := r.Group("/api")
	{
		// companies
		api.GET("/companies", controllers.GetAllCompanies)
		api.GET("/companies/:id", controllers.GetCompanyByID)
		api.POST("/companies", controllers.CreateCompany)
		api.PUT("/companies/:id", controllers.UpdateCompany)
		api.DELETE("/companies/:id", controllers.DeleteCompany)

		// offices
		api.GET("/offices", controllers.GetAllOffices)
		api.GET("/offices/:id", controllers.GetOfficeByID)
		api.POST("/offices", controllers.CreateOffice)
		api.PUT("/offices/:id", controllers.UpdateOffice)
		api.DELETE("/offices/:id", controllers.DeleteOffice)

		// branches
		api.GET("/branches", controllers.GetAllBranches)
		api.GET("/branches/:id", controllers.GetBranchByID)
		api.POST("/branches", controllers.CreateBranch)
		api.PUT("/branches/:id", controllers.UpdateBranch)
		api.DELETE("/branches/:id", controllers.DeleteBranch)

		// agents
		api.GET("/agents", controllers.GetAllAgents)
		api.GET("/agents/:id", controllers.GetAgentByID)
		api.POST("/agents", controllers.CreateAgent)
		api.PUT("/agents/:id", controllers.UpdateAgent)
		api.DELETE("/agents/:id", controllers.DeleteAgent)

		// departments
		api.GET("/departments", controllers.GetAllDepartments)
		api.GET("/departments/:id", controllers.GetDepartmentByID)
		api.POST("/departments", controllers.CreateDepartment)
		api.PUT("/departments/:id", controllers.UpdateDepartment)
		api.DELETE("/departments/:id", controllers.DeleteDepartment)

		// drivers
		api.GET("/drivers", controllers.GetAllDrivers)
		api.GET("/drivers/:id", controllers.GetDriverByID)
		api.POST("/drivers", controllers.CreateDriver)
		api.PUT("/drivers/:id", controllers.UpdateDriver)
		api.DELETE("/drivers/:id", controllers.DeleteDriver)

		// couriers
		api.GET("/couriers", controllers.GetAllCouriers)
		api.GET("/couriers/:id", controllers.GetCourierByID)
		api.POST("/couriers", controllers.CreateCourier)
		api.PUT("/couriers/:id", controllers.UpdateCourier)
		api.DELETE("/couriers/:id", controllers.DeleteCourier)

		// marketing staff
		api.GET("/marketing-staff", controllers.GetAllMarketingStaffs)
		api.GET("/marketing-staff/:id", controllers.GetMarketingStaffByID)
		api.POST("/marketing-staff", controllers.CreateMarketingStaff)
		api.PUT("/marketing-staff/:id", controllers.UpdateMarketingStaff)
		api.DELETE("/marketing-staff/:id", controllers.DeleteMarketingStaff)
	}
}
