package controllers

import (
	"backend/config"
	"backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #provinsi

func GetProvinsis(c *gin.Context) {
	var items []logistics.Provinsi
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateProvinsi(c *gin.Context) {
	var input logistics.Provinsi
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

func UpdateProvinsi(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Provinsi
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "provinsi not found"})
		return
	}
	var input logistics.Provinsi
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

func DeleteProvinsi(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Provinsi{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "provinsi deleted"})
}

// #kabupaten

func GetKabupatens(c *gin.Context) {
	var items []logistics.Kabupaten
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKabupaten(c *gin.Context) {
	var input logistics.Kabupaten
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

func UpdateKabupaten(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Kabupaten
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kabupaten not found"})
		return
	}
	var input logistics.Kabupaten
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

func DeleteKabupaten(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Kabupaten{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kabupaten deleted"})
}

// #kecamatan

func GetKecamatans(c *gin.Context) {
	var items []logistics.Kecamatan
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKecamatan(c *gin.Context) {
	var input logistics.Kecamatan
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

func UpdateKecamatan(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Kecamatan
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kecamatan not found"})
		return
	}
	var input logistics.Kecamatan
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

func DeleteKecamatan(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Kecamatan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kecamatan deleted"})
}

// #kelurahan

func GetKelurahan(c *gin.Context) {
	var items []logistics.Kelurahan
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKelurahan(c *gin.Context) {
	var input logistics.Kelurahan
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

func UpdateKelurahan(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Kelurahan
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kelurahan not found"})
		return
	}
	var input logistics.Kelurahan
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

func DeleteKelurahan(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Kelurahan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kelurahan deleted"})
}

// #kodepos

func GetKodePos(c *gin.Context) {
	var items []logistics.KodePos
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKodePos(c *gin.Context) {
	var input logistics.KodePos
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Code) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code is required"})
		return
	}
	if input.Status == "" { input.Status = "Active" }
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateKodePos(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.KodePos
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kode pos not found"})
		return
	}
	var input logistics.KodePos
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Code) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "code is required"})
		return
	}
	config.DB.Model(&existing).Updates(map[string]interface{}{"code": input.Code, "status": input.Status})
	c.JSON(http.StatusOK, existing)
}

func DeleteKodePos(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.KodePos{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kode pos deleted"})
}
