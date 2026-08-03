package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// #ledger

func GetLedgers(c *gin.Context) {
	var items []models.Ledger
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateLedger(c *gin.Context) {
	var input models.Ledger
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateLedger(c *gin.Context) {
	id := c.Param("id")
	var existing models.Ledger
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ledger not found"})
		return
	}
	var input models.Ledger
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{
		"kode": input.Kode,
		"nama": input.Nama,
	})
	c.JSON(http.StatusOK, existing)
}

func DeleteLedger(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Ledger{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "ledger deleted"})
}

// #accountcategory

func GetAccountCategories(c *gin.Context) {
	var items []models.AccountCategory
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateAccountCategory(c *gin.Context) {
	var input models.AccountCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateAccountCategory(c *gin.Context) {
	id := c.Param("id")
	var existing models.AccountCategory
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "account category not found"})
		return
	}
	var input models.AccountCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"nama": input.Nama})
	c.JSON(http.StatusOK, existing)
}

func DeleteAccountCategory(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.AccountCategory{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "account category deleted"})
}

// #profitlosscategory

func GetProfitLossCategories(c *gin.Context) {
	var items []models.ProfitLossCategory
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateProfitLossCategory(c *gin.Context) {
	var input models.ProfitLossCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateProfitLossCategory(c *gin.Context) {
	id := c.Param("id")
	var existing models.ProfitLossCategory
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "profit loss category not found"})
		return
	}
	var input models.ProfitLossCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{
		"kode": input.Kode,
		"nama": input.Nama,
	})
	c.JSON(http.StatusOK, existing)
}

func DeleteProfitLossCategory(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.ProfitLossCategory{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "profit loss category deleted"})
}

// #cashflowcategory

func GetCashflowCategories(c *gin.Context) {
	var items []models.CashflowCategory
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateCashflowCategory(c *gin.Context) {
	var input models.CashflowCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateCashflowCategory(c *gin.Context) {
	id := c.Param("id")
	var existing models.CashflowCategory
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "cashflow category not found"})
		return
	}
	var input models.CashflowCategory
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"nama": input.Nama})
	c.JSON(http.StatusOK, existing)
}

func DeleteCashflowCategory(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.CashflowCategory{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "cashflow category deleted"})
}
