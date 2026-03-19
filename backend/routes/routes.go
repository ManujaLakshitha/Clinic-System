package routes

import (
	"net/http"

	"clinic-system/handlers"
)

func SetupRoutes() {
	http.HandleFunc("/process", handlers.ProcessHandler)
	http.HandleFunc("/bill", handlers.BillHandler)
}
