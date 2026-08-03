package controllers

import (
	"backend/config"
	logistik "backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #marketing

func GetMarketings(c *gin.Context) {
	var items []logistik.Marketing
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateMarketing(c *gin.Context) {
	var input logistik.Marketing
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.BranchRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
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

func UpdateMarketing(c *gin.Context) {
	id := c.Param("id")
	var existing logistik.Marketing
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "marketing not found"})
		return
	}
	var input logistik.Marketing
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.BranchRef{}, *input.BranchID).Error; err != nil {
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

func DeleteMarketing(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistik.Marketing{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "marketing deleted"})
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
		if err := config.DB.First(&logistik.BranchRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
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
		if err := config.DB.First(&logistik.BranchRef{}, *input.BranchID).Error; err != nil {
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

// #courier

func GetCouriers(c *gin.Context) {
	var items []logistik.Courier
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateCourier(c *gin.Context) {
	var input logistik.Courier
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.BranchRef{}, *input.BranchID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "branch not found"})
			return
		}
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

func UpdateCourier(c *gin.Context) {
	id := c.Param("id")
	var existing logistik.Courier
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "courier not found"})
		return
	}
	var input logistik.Courier
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.BranchID != nil {
		if err := config.DB.First(&logistik.BranchRef{}, *input.BranchID).Error; err != nil {
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

func DeleteCourier(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistik.Courier{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "courier deleted"})
}
