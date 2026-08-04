package controllers

import (
	"backend/config"
	"backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #mode

func GetModes(c *gin.Context) {
	var items []logistics.Mode
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateMode(c *gin.Context) {
	var input logistics.Mode
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if strings.TrimSpace(input.Divider) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "divider is required"})
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

func UpdateMode(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Mode
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "mode not found"})
		return
	}
	var input logistics.Mode
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if strings.TrimSpace(input.Divider) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "divider is required"})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"name": input.Name, "divider": input.Divider, "status": input.Status})
	c.JSON(http.StatusOK, existing)
}

func DeleteMode(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Mode{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "mode deleted"})
}

// #servicecategory

func GetServiceCategories(c *gin.Context) {
	var items []logistics.ServiceCategory
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateServiceCategory(c *gin.Context) {
	var input logistics.ServiceCategory
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

func UpdateServiceCategory(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.ServiceCategory
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "service category not found"})
		return
	}
	var input logistics.ServiceCategory
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

func DeleteServiceCategory(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.ServiceCategory{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "service category deleted"})
}

// #deliveryservice

func GetDeliveryServices(c *gin.Context) {
	var items []logistics.DeliveryService
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateDeliveryService(c *gin.Context) {
	var input logistics.DeliveryService
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.ServiceCategoryID != nil {
		if err := config.DB.First(&logistics.ServiceCategory{}, *input.ServiceCategoryID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "service category not found"})
			return
		}
	}
	if input.ModaID != nil {
		if err := config.DB.First(&logistics.Mode{}, *input.ModaID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "mode not found"})
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

func UpdateDeliveryService(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.DeliveryService
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "delivery service not found"})
		return
	}
	var input logistics.DeliveryService
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.ServiceCategoryID != nil {
		if err := config.DB.First(&logistics.ServiceCategory{}, *input.ServiceCategoryID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "service category not found"})
			return
		}
	}
	if input.ModaID != nil {
		if err := config.DB.First(&logistics.Mode{}, *input.ModaID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "mode not found"})
			return
		}
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{
		"name":                input.Name,
		"service_category_id": input.ServiceCategoryID,
		"moda_id":             input.ModaID,
		"status":              input.Status,
	})
	c.JSON(http.StatusOK, existing)
}

func DeleteDeliveryService(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.DeliveryService{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "delivery service deleted"})
}

// #goodstype

func GetGoodsTypes(c *gin.Context) {
	var items []logistics.GoodsType
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateGoodsType(c *gin.Context) {
	var input logistics.GoodsType
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

func UpdateGoodsType(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.GoodsType
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "goods type not found"})
		return
	}
	var input logistics.GoodsType
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

func DeleteGoodsType(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.GoodsType{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "goods type deleted"})
}

// #costtype

func GetCostTypes(c *gin.Context) {
	var items []logistics.CostType
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateCostType(c *gin.Context) {
	var input logistics.CostType
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

func UpdateCostType(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.CostType
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "cost type not found"})
		return
	}
	var input logistics.CostType
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

func DeleteCostType(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.CostType{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "cost type deleted"})
}

// #term

func GetTerms(c *gin.Context) {
	var items []logistics.Term
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateTerm(c *gin.Context) {
	var input logistics.Term
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

func UpdateTerm(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Term
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "term not found"})
		return
	}
	var input logistics.Term
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

func DeleteTerm(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Term{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "term deleted"})
}
