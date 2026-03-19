// backend/main.go
package main

import (
	"log"
	"net/http"

	"clinic-system/config"
	"clinic-system/routes"
)

func main() {
	config.InitDB()
	routes.SetupRoutes()

	log.Println("Server running on port 8080")
	http.ListenAndServe(":8080", nil)
}
