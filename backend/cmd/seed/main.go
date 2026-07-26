package main

import (
	"backend/config"
	"backend/models"
	"fmt"
)

func main() {
	config.ConnectDatabase()

	// 1. Ledger
	ledger := models.Ledger{Kode: "100", Nama: "AKTIVA LANCAR"}
	config.DB.Create(&ledger)
	fmt.Println("Ledger created:", ledger.ID, ledger.Kode, ledger.Nama)

	// 2. Kategori Akun
	kategori := models.KategoriAkun{Nama: "AKTIVA LANCAR/TETAP"}
	config.DB.Create(&kategori)
	fmt.Println("Kategori Akun created:", kategori.ID, kategori.Nama)

	// 3. Rugi Laba
	rugiLaba := models.RugiLabaKategori{Kode: "TRX", Nama: "LabaRugi"}
	config.DB.Create(&rugiLaba)
	fmt.Println("Rugi Laba created:", rugiLaba.ID, rugiLaba.Kode, rugiLaba.Nama)

	// 4. Cashflow
	cashflow := models.KategoriCashflow{Nama: "Operating Activity"}
	config.DB.Create(&cashflow)
	fmt.Println("Cashflow created:", cashflow.ID, cashflow.Nama)

	// 5. Perkiraan / Account
	account := models.Account{
		KodeRekening: "11010000",
		NamaRekening: "KAS/BANK",
		LedgerID:     ledger.ID,
		KategoriAkunID: kategori.ID,
		Posisi:       "Neraca",
		NormalBalance: "Debet",
		Tampil:       "Show",
		JenisKategori: "Child",
		Status:       true,
	}
	config.DB.Create(&account)
	fmt.Println("Account created:", account.ID, account.KodeRekening, account.NamaRekening)

	// 6. Vendor (tanpa Accounting)
	vendor := models.Vendor{
		Name:       "PT Mitra Sejahtera",
		Address1:   "Jl. Sudirman No. 100",
		City:       "Jakarta Selatan",
		CodePos:    "12190",
		NoHp:       "021-5551234",
		Fax:        "021-5554321",
		Email:      "info@mitrasejahtera.co.id",
		NamaKontak: "Budi Santoso",
		Branch:     "Jakarta",
		Status:     "Active",
		Npwp: models.Npwp{
			NoNpwp:   "01.234.567.8-901.000",
			NamaNpwp: "PT Mitra Sejahtera",
			Address1: "Jl. Sudirman No. 100",
			City:     "Jakarta Selatan",
			CodePos:  "12190",
		},
	}
	config.DB.Create(&vendor)
	fmt.Println("Vendor created:", vendor.ID, vendor.Name)
	fmt.Println("NPWP created:", vendor.Npwp.ID, vendor.Npwp.NoNpwp)

	fmt.Println("\n=== Seed selesai! ===")
}
