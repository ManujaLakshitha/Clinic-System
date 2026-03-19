// backend/handlers/ai_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	"clinic-system/services"
)

func ProcessHandler(w http.ResponseWriter, r *http.Request) {
	input := r.URL.Query().Get("text")

	result, visitID, err := services.ProcessAndSave(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"visit_id":  visitID,
		"drugs":     result.Drugs,
		"lab_tests": result.LabTests,
		"notes":     result.Notes,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
