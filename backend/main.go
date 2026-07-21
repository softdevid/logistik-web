package main

import (
	"backend/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	routes.SetUpRoutes(r)
	r.Run() // default listen di :8080
}
