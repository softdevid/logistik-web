package controllers

import (
	"backend/config"
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// #ledger

func GetLedgersAll(c *gin.Context) {
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
		c.JSON(http.StatusNotFound, gin.H{"error": "ledger tidak ditemukan"})
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
	c.JSON(http.StatusOK, gin.H{"message": "ledger berhasil dihapus"})
}

// #kategoriakun

func GetKategoriAkunsAll(c *gin.Context) {
	var items []models.KategoriAkun
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKategoriAkun(c *gin.Context) {
	var input models.KategoriAkun
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

func UpdateKategoriAkun(c *gin.Context) {
	id := c.Param("id")
	var existing models.KategoriAkun
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kategori akun tidak ditemukan"})
		return
	}
	var input models.KategoriAkun
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"nama": input.Nama})
	c.JSON(http.StatusOK, existing)
}

func DeleteKategoriAkun(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.KategoriAkun{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kategori akun berhasil dihapus"})
}

// #rugilaba

func GetRugiLabaAll(c *gin.Context) {
	var items []models.RugiLabaKategori
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateRugiLaba(c *gin.Context) {
	var input models.RugiLabaKategori
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

func UpdateRugiLaba(c *gin.Context) {
	id := c.Param("id")
	var existing models.RugiLabaKategori
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kategori rugi laba tidak ditemukan"})
		return
	}
	var input models.RugiLabaKategori
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

func DeleteRugiLaba(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.RugiLabaKategori{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kategori rugi laba berhasil dihapus"})
}

// #cashflow

func GetCashflowAll(c *gin.Context) {
	var items []models.KategoriCashflow
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateCashflow(c *gin.Context) {
	var input models.KategoriCashflow
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

func UpdateCashflow(c *gin.Context) {
	id := c.Param("id")
	var existing models.KategoriCashflow
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kategori cashflow tidak ditemukan"})
		return
	}
	var input models.KategoriCashflow
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"nama": input.Nama})
	c.JSON(http.StatusOK, existing)
}

func DeleteCashflow(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.KategoriCashflow{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kategori cashflow berhasil dihapus"})
}
