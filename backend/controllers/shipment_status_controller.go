package controllers

import (
	"backend/config"
	"backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #shipmentstatus

func GetShipmentStatuses(c *gin.Context) {
	var items []logistics.ShipmentStatus
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateShipmentStatus(c *gin.Context) {
	var input logistics.ShipmentStatus
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Code) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code is required"})
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

func UpdateShipmentStatus(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.ShipmentStatus
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "shipment status not found"})
		return
	}
	var input logistics.ShipmentStatus
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Code) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code is required"})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"code": input.Code, "name": input.Name, "status": input.Status})
	c.JSON(http.StatusOK, existing)
}

func DeleteShipmentStatus(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.ShipmentStatus{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "shipment status deleted"})
}
