package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetVendors(c *gin.Context) {
	var vendors []models.Vendor
	if err := config.DB.Preload("Npwp").Preload("Accounting").Find(&vendors).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, vendors)
}

func GetVendor(c *gin.Context) {
	id := c.Param("id")
	var vendor models.Vendor
	if err := config.DB.Preload("Npwp").Preload("Accounting").First(&vendor, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "vendor not found"})
		return
	}
	c.JSON(http.StatusOK, vendor)
}

func CreateVendor(c *gin.Context) {
	var input models.Vendor
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := config.DB.Begin()

	if err := tx.Create(&input).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if input.Npwp.NoNpwp != "" {
		npwp := input.Npwp
		npwp.VendorID = input.ID
		npwp.ID = 0
		if err := tx.Create(&npwp).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		input.Npwp = npwp
	}

	if input.Accounting.DebitAccountID != 0 || input.Accounting.CreditHutangAccountID != 0 || input.Accounting.CreditPendapatanAccountID != 0 {
		acc := input.Accounting
		acc.VendorID = input.ID
		acc.ID = 0
		if err := tx.Create(&acc).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		input.Accounting = acc
	}

	tx.Commit()

	config.DB.Preload("Npwp").Preload("Accounting").First(&input, input.ID)
	c.JSON(http.StatusCreated, input)
}

func UpdateVendor(c *gin.Context) {
	id := c.Param("id")
	idUint, _ := strconv.ParseUint(id, 10, 32)

	var existing models.Vendor
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "vendor not found"})
		return
	}

	var input models.Vendor
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := config.DB.Begin()

	updates := map[string]interface{}{
		"name":        input.Name,
		"address1":    input.Address1,
		"address2":    input.Address2,
		"city":        input.City,
		"code_pos":    input.CodePos,
		"no_hp":       input.NoHp,
		"fax":         input.Fax,
		"email":       input.Email,
		"nama_kontak": input.NamaKontak,
		"branch":      input.Branch,
		"status":      input.Status,
	}
	if err := tx.Model(&existing).Updates(updates).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var existingNpwp models.Npwp
	if err := tx.Where("vendor_id = ?", idUint).First(&existingNpwp).Error; err == nil {
		npwpUpdates := map[string]interface{}{
			"no_npwp":   input.Npwp.NoNpwp,
			"nama_npwp": input.Npwp.NamaNpwp,
			"address1":  input.Npwp.Address1,
			"address2":  input.Npwp.Address2,
			"city":      input.Npwp.City,
			"code_pos":  input.Npwp.CodePos,
		}
		tx.Model(&existingNpwp).Updates(npwpUpdates)
	} else if input.Npwp.NoNpwp != "" {
		npwp := input.Npwp
		npwp.VendorID = uint(idUint)
		npwp.ID = 0
		tx.Create(&npwp)
	}

	var existingAcc models.Accounting
	if err := tx.Where("vendor_id = ?", idUint).First(&existingAcc).Error; err == nil {
		accUpdates := map[string]interface{}{
			"debit_account_id":             input.Accounting.DebitAccountID,
			"credit_hutang_account_id":     input.Accounting.CreditHutangAccountID,
			"credit_pendapatan_account_id": input.Accounting.CreditPendapatanAccountID,
			"bagi_hasil_percent":           input.Accounting.BagiHasilPercent,
			"komisi_percent":               input.Accounting.KomisiPercent,
		}
		tx.Model(&existingAcc).Updates(accUpdates)
	} else if input.Accounting.DebitAccountID != 0 || input.Accounting.CreditHutangAccountID != 0 || input.Accounting.CreditPendapatanAccountID != 0 {
		acc := input.Accounting
		acc.VendorID = uint(idUint)
		acc.ID = 0
		tx.Create(&acc)
	}

	tx.Commit()

	config.DB.Preload("Npwp").Preload("Accounting").First(&existing, id)
	c.JSON(http.StatusOK, existing)
}

func DeleteVendor(c *gin.Context) {
	id := c.Param("id")
	var vendor models.Vendor
	if err := config.DB.First(&vendor, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "vendor not found"})
		return
	}

	tx := config.DB.Begin()
	tx.Where("vendor_id = ?", id).Delete(&models.Npwp{})
	tx.Where("vendor_id = ?", id).Delete(&models.Accounting{})
	tx.Delete(&vendor)
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"message": "vendor deleted"})
}

func GetAccounts(c *gin.Context) {
	var accounts []models.Account
	if err := config.DB.Select("id, kode_rekening, nama_rekening").Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, accounts)
}

func GetBranches(c *gin.Context) {
	var cabangs []models.Branch
	if err := config.DB.Find(&cabangs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, cabangs)
}
