package main

import (
	"log"
	"net/http"

	"clinic-system/config"
	"clinic-system/routes"

	"github.com/joho/godotenv"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	godotenv.Load()
	config.InitDB()
	routes.SetupRoutes()

	handler := enableCORS(http.DefaultServeMux)

	log.Println("Server running on port 8080")
	http.ListenAndServe(":8080", handler)
}
