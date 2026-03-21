// backend/routes/routes.go
package routes

import (
	"github.com/gorilla/mux"

	"clinic-system/handlers"
	"clinic-system/middleware"
)

func SetupRoutes() *mux.Router {

	router := mux.NewRouter()

	router.HandleFunc("/process", handlers.ProcessHandler).Methods("GET")
	router.HandleFunc("/save-visit", handlers.SaveVisitHandler).Methods("POST")

	router.HandleFunc("/bill", handlers.BillHandler).Methods("GET")

	router.HandleFunc("/register", handlers.RegisterHandler).Methods("POST")
	router.HandleFunc("/login", handlers.LoginHandler).Methods("POST")

	router.HandleFunc("/visits", middleware.AuthMiddleware(handlers.GetVisitsHandler)).Methods("GET")
	router.HandleFunc("/visit-details", middleware.AuthMiddleware(handlers.GetVisitDetailsHandler)).Methods("GET")
	router.HandleFunc("/delete-visit", middleware.AuthMiddleware(handlers.DeleteVisitHandler)).Methods("DELETE")
	router.HandleFunc("/update-visit", middleware.AuthMiddleware(handlers.UpdateVisitHandler)).Methods("PUT")

	return router
}
