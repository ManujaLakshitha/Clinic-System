package handlers

import (
	"encoding/json"
	"net/http"

	"clinic-system/services"
)

func ProcessHandler(w http.ResponseWriter, r *http.Request) {
	input := r.URL.Query().Get("text")

	err := services.ProcessAndSave(input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "processed successfully",
	})
}
