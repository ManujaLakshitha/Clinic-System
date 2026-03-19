package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"clinic-system/services"
)

func BillHandler(w http.ResponseWriter, r *http.Request) {
	visitIDStr := r.URL.Query().Get("visit_id")

	visitID, err := strconv.Atoi(visitIDStr)
	if err != nil {
		http.Error(w, "invalid visit id", http.StatusBadRequest)
		return
	}

	total, _ := services.CalculateBill(visitID)
	services.SaveBill(visitID, total)

	json.NewEncoder(w).Encode(map[string]float64{
		"total": total,
	})
}
