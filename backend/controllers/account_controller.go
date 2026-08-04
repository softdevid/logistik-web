package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAccountsList(c *gin.Context) {
	var accounts []models.Account
	if err := config.DB.Find(&accounts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, accounts)
}

func GetAccount(c *gin.Context) {
	id := c.Param("id")
	var account models.Account
	if err := config.DB.First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
		return
	}
	c.JSON(http.StatusOK, account)
}

func CreateAccount(c *gin.Context) {
	var input models.Account
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

func UpdateAccount(c *gin.Context) {
	id := c.Param("id")
	var existing models.Account
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
		return
	}

	var input models.Account
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{
		"kode_rekening":        input.KodeRekening,
		"inisial_akun":         input.InisialAkun,
		"nama_rekening":        input.NamaRekening,
		"induk_id":             input.IndukID,
		"ledger_id":            input.LedgerID,
		"kategori_akun_id":     input.KategoriAkunID,
		"posisi":               input.Posisi,
		"normal_balance":       input.NormalBalance,
		"tampil":               input.Tampil,
		"jenis_kategori":       input.JenisKategori,
		"rugi_laba_id":         input.RugiLabaID,
		"kategori_cashflow_id": input.KategoriCashflowID,
		"cabang_id":            input.CabangID,
		"status":               input.Status,
	}

	if err := config.DB.Model(&existing).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	config.DB.First(&existing, id)
	c.JSON(http.StatusOK, existing)
}

func DeleteAccount(c *gin.Context) {
	id := c.Param("id")
	var account models.Account
	if err := config.DB.First(&account, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
		return
	}
	if err := config.DB.Delete(&account).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "account deleted"})
}
