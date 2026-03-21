// backend/routes/routes.go
package routes

import (
	"net/http"

	"clinic-system/handlers"
	"clinic-system/middleware"
)

func SetupRoutes() {
	http.HandleFunc("/process", handlers.ProcessHandler)
	http.HandleFunc("/bill", handlers.BillHandler)
	http.HandleFunc("/visits", handlers.GetVisitsHandler)
	http.HandleFunc("/visit-details", handlers.GetVisitDetailsHandler)
	http.HandleFunc("/delete-visit", handlers.DeleteVisitHandler)
	http.HandleFunc("/update-visit", handlers.UpdateVisitHandler)
	http.HandleFunc("/register", handlers.RegisterHandler)
	http.HandleFunc("/login", handlers.LoginHandler)
	http.HandleFunc("/visits", middleware.AuthMiddleware(handlers.GetVisitsHandler))
	http.HandleFunc("/delete-visit", middleware.AuthMiddleware(handlers.DeleteVisitHandler))
}
