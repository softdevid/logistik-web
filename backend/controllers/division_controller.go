package controllers

import (
	"backend/config"
	logistik "backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #pemasaran

func GetPemasarans(c *gin.Context) {
	var items []logistik.Pemasaran
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreatePemasaran(c *gin.Context) {
	var input logistik.Pemasaran
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.CabangRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	if input.Status == "" { input.Status = "Active" }
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdatePemasaran(c *gin.Context) {
	id := c.Param("id")
	var existing logistik.Pemasaran
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pemasaran not found"})
		return
	}
	var input logistik.Pemasaran
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.CabangRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{
		"name":      input.Name,
		"address":   input.Address,
		"ktp":       input.KTP,
		"phone":     input.Phone,
		"branch_id": input.BranchID,
		"status":    input.Status,
	})
	c.JSON(http.StatusOK, existing)
}

func DeletePemasaran(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistik.Pemasaran{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "pemasaran deleted"})
}

// #driver

func GetDrivers(c *gin.Context) {
	var items []logistik.Driver
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateDriver(c *gin.Context) {
	var input logistik.Driver
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.CabangRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	if input.Status == "" { input.Status = "Active" }
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateDriver(c *gin.Context) {
	id := c.Param("id")
	var existing logistik.Driver
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "driver not found"})
		return
	}
	var input logistik.Driver
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.CabangRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{
		"name":      input.Name,
		"address":   input.Address,
		"ktp":       input.KTP,
		"sim":       input.SIM,
		"phone":     input.Phone,
		"branch_id": input.BranchID,
		"status":    input.Status,
	})
	c.JSON(http.StatusOK, existing)
}

func DeleteDriver(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistik.Driver{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "driver deleted"})
}

// #kurir

func GetKurirs(c *gin.Context) {
	var items []logistik.Kurir
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKurir(c *gin.Context) {
	var input logistik.Kurir
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.CabangRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	if input.Status == "" { input.Status = "Active" }
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateKurir(c *gin.Context) {
	id := c.Param("id")
	var existing logistik.Kurir
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kurir not found"})
		return
	}
	var input logistik.Kurir
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.CabangRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{
		"name":      input.Name,
		"address":   input.Address,
		"ktp":       input.KTP,
		"phone":     input.Phone,
		"branch_id": input.BranchID,
		"status":    input.Status,
	})
	c.JSON(http.StatusOK, existing)
}

func DeleteKurir(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistik.Kurir{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kurir deleted"})
}
