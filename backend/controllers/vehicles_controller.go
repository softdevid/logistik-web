package controllers

import (
	"backend/config"
	"backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #vehicle

func GetVehicles(c *gin.Context) {
	var items []logistics.Vehicle
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateVehicle(c *gin.Context) {
	var input logistics.Vehicle
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.JenisTruckingID != nil {
		if err := config.DB.First(&logistics.TruckingType{}, *input.JenisTruckingID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "trucking type not found"})
			return
		}
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistics.BranchRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateVehicle(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Vehicle
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "vehicle not found"})
		return
	}
	var input logistics.Vehicle
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.JenisTruckingID != nil {
		if err := config.DB.First(&logistics.TruckingType{}, *input.JenisTruckingID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "trucking type not found"})
			return
		}
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistics.BranchRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{
		"name":              input.Name,
		"jenis_trucking_id": input.JenisTruckingID,
		"year":              input.Year,
		"no_polisi":         input.NoPolisi,
		"stnk_name":         input.STNKName,
		"stnk_number":       input.STNKNumber,
		"stnk_date":         input.STNKDate,
		"cylinder_capacity": input.CylinderCapacity,
		"color":             input.Color,
		"insurance_name":    input.InsuranceName,
		"insurance_expiry":  input.InsuranceExpiry,
		"description":       input.Description,
		"chassis_number":    input.ChassisNumber,
		"engine_number":     input.EngineNumber,
		"is_active":         input.IsActive,
		"service_trucking":  input.ServiceTrucking,
		"branch_id":         input.BranchID,
	})
	c.JSON(http.StatusOK, existing)
}

func DeleteVehicle(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Vehicle{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "vehicle deleted"})
}

// #vehicletype

func GetVehicleTypes(c *gin.Context) {
	var items []logistics.VehicleType
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateVehicleType(c *gin.Context) {
	var input logistics.VehicleType
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.Status == "" {
		input.Status = "Active"
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateVehicleType(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.VehicleType
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "jenis vehicle not found"})
		return
	}
	var input logistics.VehicleType
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"name": input.Name, "status": input.Status})
	c.JSON(http.StatusOK, existing)
}

func DeleteVehicleType(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.VehicleType{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "jenis vehicle deleted"})
}

// #truckingtype

func GetTruckingTypes(c *gin.Context) {
	var items []logistics.TruckingType
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateTruckingType(c *gin.Context) {
	var input logistics.TruckingType
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.Status == "" {
		input.Status = "Active"
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateTruckingType(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.TruckingType
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "trucking type not found"})
		return
	}
	var input logistics.TruckingType
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"name": input.Name, "status": input.Status})
	c.JSON(http.StatusOK, existing)
}

func DeleteTruckingType(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.TruckingType{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "trucking type deleted"})
}
