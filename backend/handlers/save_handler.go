package handlers

import (
	"encoding/json"
	"net/http"

	"clinic-system/services"
)

type SaveRequest struct {
	Drugs    []string `json:"drugs"`
	LabTests []string `json:"lab_tests"`
	Notes    []string `json:"notes"`
}

func SaveVisitHandler(w http.ResponseWriter, r *http.Request) {
	var req SaveRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "invalid request", 400)
		return
	}

	visitID, err := services.SaveVisitData(req.Drugs, req.LabTests, req.Notes)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"visit_id": visitID,
	})
}
