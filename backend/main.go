package main

import (
	"backend/config"
	"backend/models"
	"backend/models/logistics"
	"backend/routes"

	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// konek database dulu sebelum setup routes
	config.ConnectDatabase()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept", "x-api-key"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.SetUpRoutes(r)
	config.DB.AutoMigrate(
		&models.Vendor{}, &models.Npwp{}, &models.Accounting{},
		&models.Account{}, &models.Ledger{}, &models.KategoriAkun{},
		&models.RugiLabaKategori{}, &models.KategoriCashflow{}, &models.Cabang{},
		&logistics.Provinsi{}, &logistics.Kabupaten{}, &logistics.Kecamatan{},
		&logistics.Kelurahan{}, &logistics.KodePos{},
		&logistics.Pemasaran{}, &logistics.Driver{}, &logistics.Kurir{},
		&logistics.Moda{}, &logistics.KategoriLayanan{}, &logistics.LayananPengantaran{},
		&logistics.JenisBarang{}, &logistics.JenisBiaya{}, &logistics.Termin{},
		&logistics.Kendaraan{}, &logistics.JenisKendaraan{}, &logistics.JenisTrucking{},
	)

	// #dropunique — drop stale unique indexes that were removed from models
	dropIndexes := []string{
		"DROP INDEX IF EXISTS idx_provinsis_nama",
		"DROP INDEX IF EXISTS idx_provinsis_name",
		"DROP INDEX IF EXISTS idx_kabupatens_nama",
		"DROP INDEX IF EXISTS idx_kabupatens_name",
		"DROP INDEX IF EXISTS idx_kecamatans_nama",
		"DROP INDEX IF EXISTS idx_kecamatans_name",
		"DROP INDEX IF EXISTS idx_kelurahan_nama",
		"DROP INDEX IF EXISTS idx_kelurahan_name",
		"DROP INDEX IF EXISTS idx_kode_pos_kode",
		"DROP INDEX IF EXISTS idx_kode_pos_code",
		"DROP INDEX IF EXISTS idx_pemasarans_nama",
		"DROP INDEX IF EXISTS idx_pemasarans_name",
		"DROP INDEX IF EXISTS idx_drivers_nama",
		"DROP INDEX IF EXISTS idx_drivers_name",
		"DROP INDEX IF EXISTS idx_kurirs_nama",
		"DROP INDEX IF EXISTS idx_kurirs_name",
		"DROP INDEX IF EXISTS idx_modas_nama",
		"DROP INDEX IF EXISTS idx_modas_name",
		"DROP INDEX IF EXISTS idx_modas_divider",
		"DROP INDEX IF EXISTS idx_kategori_layanan_nama",
		"DROP INDEX IF EXISTS idx_kategori_layanan_name",
		"DROP INDEX IF EXISTS idx_layanan_pengantarans_nama",
		"DROP INDEX IF EXISTS idx_layanan_pengantarans_name",
		"DROP INDEX IF EXISTS idx_layanan_pengantarans_kategori_layanan",
		"DROP INDEX IF EXISTS idx_layanan_pengantarans_service_category_id",
		"DROP INDEX IF EXISTS idx_jenis_barangs_nama",
		"DROP INDEX IF EXISTS idx_jenis_barangs_name",
		"DROP INDEX IF EXISTS idx_jenis_biayas_nama",
		"DROP INDEX IF EXISTS idx_jenis_biayas_name",
		"DROP INDEX IF EXISTS idx_termins_nama",
		"DROP INDEX IF EXISTS idx_termins_name",
		"DROP INDEX IF EXISTS idx_kendaraans_nama",
		"DROP INDEX IF EXISTS idx_kendaraans_name",
		"DROP INDEX IF EXISTS idx_jenis_kendaraans_nama",
		"DROP INDEX IF EXISTS idx_jenis_kendaraans_name",
		"DROP INDEX IF EXISTS idx_jenis_truckings_nama",
		"DROP INDEX IF EXISTS idx_jenis_truckings_name",
	}
	for _, q := range dropIndexes {
		config.DB.Exec(q)
	}
	r.Run() // default listen di :8080, ini harus paling akhir
}
