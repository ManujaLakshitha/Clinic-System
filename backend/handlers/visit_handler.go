// frontend/handlers/visit_handler.go
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

func GetVisitDetailsHandler(w http.ResponseWriter, r *http.Request) {
	visitID := r.URL.Query().Get("id")

	var drugs []string
	var tests []string
	var notes []string

	// Drugs
	rows1, _ := config.DB.Query("SELECT name FROM drugs WHERE visit_id=$1", visitID)
	for rows1.Next() {
		var d string
		rows1.Scan(&d)
		drugs = append(drugs, d)
	}

	// Tests
	rows2, _ := config.DB.Query("SELECT test_name FROM lab_tests WHERE visit_id=$1", visitID)
	for rows2.Next() {
		var t string
		rows2.Scan(&t)
		tests = append(tests, t)
	}

	// Notes
	rows3, _ := config.DB.Query("SELECT content FROM notes WHERE visit_id=$1", visitID)
	for rows3.Next() {
		var n string
		rows3.Scan(&n)
		notes = append(notes, n)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"drugs":     drugs,
		"lab_tests": tests,
		"notes":     notes,
	})
}
