package handlers

import (
	"encoding/json"
	"net/http"

	"clinic-system/config"
)

type Visit struct {
	ID int `json:"id"`
}

func GetVisitsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := config.DB.Query("SELECT id FROM visits ORDER BY id DESC")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	visits := []Visit{}

	for rows.Next() {
		var v Visit
		rows.Scan(&v.ID)
		visits = append(visits, v)
	}

	json.NewEncoder(w).Encode(visits)
}
