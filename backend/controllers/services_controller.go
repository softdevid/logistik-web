package controllers

import (
	"backend/config"
	"backend/models/logistics"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// #moda

func GetModas(c *gin.Context) {
	var items []logistics.Moda
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateModa(c *gin.Context) {
	var input logistics.Moda
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
	if input.Status == "" { input.Status = "Active" }
	if err := config.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, input)
}

func UpdateModa(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Moda
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "moda not found"})
		return
	}
	var input logistics.Moda
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

func DeleteModa(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Moda{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "moda deleted"})
}

// #kategorilayanan

func GetKategoriLayanans(c *gin.Context) {
	var items []logistics.KategoriLayanan
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateKategoriLayanan(c *gin.Context) {
	var input logistics.KategoriLayanan
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

func UpdateKategoriLayanan(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.KategoriLayanan
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kategori layanan not found"})
		return
	}
	var input logistics.KategoriLayanan
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

func DeleteKategoriLayanan(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.KategoriLayanan{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kategori layanan deleted"})
}

// #layanananpengantaran

func GetLayananPengantarans(c *gin.Context) {
	var items []logistics.LayananPengantaran
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateLayananPengantaran(c *gin.Context) {
	var input logistics.LayananPengantaran
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.ServiceCategoryID != nil {
		if err := config.DB.First(&logistics.KategoriLayanan{}, *input.ServiceCategoryID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "kategori layanan not found"})
			return
		}
	}
	if input.ModaID != nil {
		if err := config.DB.First(&logistics.Moda{}, *input.ModaID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "moda not found"})
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

func UpdateLayananPengantaran(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.LayananPengantaran
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "layanan pengantaran not found"})
		return
	}
	var input logistics.LayananPengantaran
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if strings.TrimSpace(input.Name) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.ServiceCategoryID != nil {
		if err := config.DB.First(&logistics.KategoriLayanan{}, *input.ServiceCategoryID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "kategori layanan not found"})
			return
		}
	}
	if input.ModaID != nil {
		if err := config.DB.First(&logistics.Moda{}, *input.ModaID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "moda not found"})
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

func DeleteLayananPengantaran(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.LayananPengantaran{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "layanan pengantaran deleted"})
}

// #jenisbarang

func GetJenisBarangs(c *gin.Context) {
	var items []logistics.JenisBarang
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateJenisBarang(c *gin.Context) {
	var input logistics.JenisBarang
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

func UpdateJenisBarang(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.JenisBarang
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "jenis barang not found"})
		return
	}
	var input logistics.JenisBarang
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

func DeleteJenisBarang(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.JenisBarang{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "jenis barang deleted"})
}

// #jenisbiaya

func GetJenisBiayas(c *gin.Context) {
	var items []logistics.JenisBiaya
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateJenisBiaya(c *gin.Context) {
	var input logistics.JenisBiaya
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

func UpdateJenisBiaya(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.JenisBiaya
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "jenis biaya not found"})
		return
	}
	var input logistics.JenisBiaya
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

func DeleteJenisBiaya(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.JenisBiaya{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "jenis biaya deleted"})
}

// #termin

func GetTermins(c *gin.Context) {
	var items []logistics.Termin
	config.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateTermin(c *gin.Context) {
	var input logistics.Termin
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

func UpdateTermin(c *gin.Context) {
	id := c.Param("id")
	var existing logistics.Termin
	if err := config.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "termin not found"})
		return
	}
	var input logistics.Termin
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

func DeleteTermin(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&logistics.Termin{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "termin deleted"})
}
