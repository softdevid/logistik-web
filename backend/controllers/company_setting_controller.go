package controllers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"backend/config"
	"backend/models/company"
)

func parseCompanyID(c *gin.Context) (int64, bool) {
	id, err := strconv.ParseInt(c.Param("companyId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return 0, false
	}
	return id, true
}

func parseSettingID(c *gin.Context) (int64, bool) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID tidak valid"})
		return 0, false
	}
	return id, true
}

// ===================== COMPANY INVOICE =====================

func GetCompanyInvoices(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var data []company.CompanyInvoice
	if err := config.DB.Where("company_id = ?", companyID).Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func CreateCompanyInvoice(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var input company.CompanyInvoice
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CompanyID = companyID
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": input})
}

func UpdateCompanyInvoice(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	var existing company.CompanyInvoice
	if err := config.DB.Where("company_id = ? AND company_invoice_id = ?", companyID, id).First(&existing).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "data tidak ditemukan"})
		return
	}
	var input company.CompanyInvoice
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CompanyInvoiceID = id
	input.CompanyID = companyID
	input.CreatedAt = existing.CreatedAt
	input.UpdatedAt = time.Now()
	if err := config.DB.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteCompanyInvoice(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	if err := config.DB.Where("company_id = ? AND company_invoice_id = ?", companyID, id).Delete(&company.CompanyInvoice{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "data berhasil dihapus"})
}

// ===================== COMPANY BANK =====================

func GetCompanyBanks(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var data []company.CompanyBank
	if err := config.DB.Where("company_id = ?", companyID).Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func CreateCompanyBank(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var input company.CompanyBank
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CompanyID = companyID
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": input})
}

func UpdateCompanyBank(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	var existing company.CompanyBank
	if err := config.DB.Where("company_id = ? AND company_bank_id = ?", companyID, id).First(&existing).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "data tidak ditemukan"})
		return
	}
	var input company.CompanyBank
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CompanyBankID = id
	input.CompanyID = companyID
	input.CreatedAt = existing.CreatedAt
	input.UpdatedAt = time.Now()
	if err := config.DB.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteCompanyBank(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	if err := config.DB.Where("company_id = ? AND company_bank_id = ?", companyID, id).Delete(&company.CompanyBank{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "data berhasil dihapus"})
}

// ===================== COMPANY DIGITAL WALLET =====================

func GetCompanyDigitalWallets(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var data []company.CompanyDigitalWallet
	if err := config.DB.Where("company_id = ?", companyID).Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func CreateCompanyDigitalWallet(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var input company.CompanyDigitalWallet
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CompanyID = companyID
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": input})
}

func UpdateCompanyDigitalWallet(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	var existing company.CompanyDigitalWallet
	if err := config.DB.Where("company_id = ? AND company_digital_wallet_id = ?", companyID, id).First(&existing).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "data tidak ditemukan"})
		return
	}
	var input company.CompanyDigitalWallet
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CompanyDigitalWalletID = id
	input.CompanyID = companyID
	input.CreatedAt = existing.CreatedAt
	input.UpdatedAt = time.Now()
	if err := config.DB.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteCompanyDigitalWallet(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	if err := config.DB.Where("company_id = ? AND company_digital_wallet_id = ?", companyID, id).Delete(&company.CompanyDigitalWallet{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "data berhasil dihapus"})
}

// ===================== CUSTOMER WHATSAPP NOTIFICATION =====================

func GetCompanyWhatsappNotifications(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var data []company.CustomerWhatsappNotification
	if err := config.DB.Where("company_id = ?", companyID).Find(&data).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

func CreateCompanyWhatsappNotification(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	var input company.CustomerWhatsappNotification
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CompanyID = companyID
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": input})
}

func UpdateCompanyWhatsappNotification(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	var existing company.CustomerWhatsappNotification
	if err := config.DB.Where("company_id = ? AND customer_whatsapp_notification_id = ?", companyID, id).First(&existing).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "data tidak ditemukan"})
		return
	}
	var input company.CustomerWhatsappNotification
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	input.CustomerWhatsappNotificationID = id
	input.CompanyID = companyID
	input.CreatedAt = existing.CreatedAt
	if err := config.DB.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": input})
}

func DeleteCompanyWhatsappNotification(c *gin.Context) {
	companyID, ok := parseCompanyID(c)
	if !ok {
		return
	}
	id, ok := parseSettingID(c)
	if !ok {
		return
	}
	if err := config.DB.Where("company_id = ? AND customer_whatsapp_notification_id = ?", companyID, id).Delete(&company.CustomerWhatsappNotification{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "data berhasil dihapus"})
}
