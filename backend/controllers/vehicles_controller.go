package controllers

import (
	"backend/config"
	"backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #kendaraan

func GetKendaraans(c *gin.Context) {
	var items []logistics.Kendaraan
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKendaraan(c *gin.Context) {
	var input logistics.Kendaraan
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.JenisTruckingID != nil {
		if err := config.DB.First(&logistics.JenisTrucking{}, *input.JenisTruckingID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "jenis trucking not found"})
			return
		}
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistics.CabangRef{}, *input.BranchID).Error; err != nil {
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

func UpdateKendaraan(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Kendaraan
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kendaraan not found"})
		return
	}
	var input logistics.Kendaraan
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.JenisTruckingID != nil {
		if err := config.DB.First(&logistics.JenisTrucking{}, *input.JenisTruckingID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "jenis trucking not found"})
			return
		}
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistics.CabangRef{}, *input.BranchID).Error; err != nil {
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

func DeleteKendaraan(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Kendaraan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kendaraan deleted"})
}

// #jeniskendaraan

func GetJenisKendaraans(c *gin.Context) {
	var items []logistics.JenisKendaraan
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateJenisKendaraan(c *gin.Context) {
	var input logistics.JenisKendaraan
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.Status == "" { input.Status = "Active" }
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateJenisKendaraan(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.JenisKendaraan
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "jenis kendaraan not found"})
		return
	}
	var input logistics.JenisKendaraan
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

func DeleteJenisKendaraan(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.JenisKendaraan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "jenis kendaraan deleted"})
}

// #jenistrucking

func GetJenisTruckings(c *gin.Context) {
	var items []logistics.JenisTrucking
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateJenisTrucking(c *gin.Context) {
	var input logistics.JenisTrucking
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.Status == "" { input.Status = "Active" }
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateJenisTrucking(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.JenisTrucking
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "jenis trucking not found"})
		return
	}
	var input logistics.JenisTrucking
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

func DeleteJenisTrucking(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.JenisTrucking{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "jenis trucking deleted"})
}
