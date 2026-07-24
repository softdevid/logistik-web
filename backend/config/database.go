package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// load .env
	if err := godotenv.Load(); err != nil {
		log.Println("tidak menemukan file .env, menggunakan environment system")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_TIMEZONE"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("gagal konek ke database: " + err.Error())
	}

	fmt.Println("berhasil konek ke PostgreSQL!")
	DB = db

	// auto migrate
	// DB.AutoMigrate(&models.User{})
}
