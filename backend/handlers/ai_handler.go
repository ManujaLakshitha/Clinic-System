// backend/handlers/ai_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	"clinic-system/services"
)

func ProcessHandler(w http.ResponseWriter, r *http.Request) {
	input := r.URL.Query().Get("text")

	if input == "" {
		http.Error(w, "text required", 400)
		return
	}

	result, err := services.Process(input)
	if err != nil {
		http.Error(w, "Error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
