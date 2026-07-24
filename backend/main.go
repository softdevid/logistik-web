package main

import (
	"backend/config"
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// konek database dulu sebelum setup routes
	config.ConnectDatabase()

	r := gin.Default()
	routes.SetUpRoutes(r)
	r.Run() // default listen di :8080, ini harus paling akhir
}
