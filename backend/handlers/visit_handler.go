// frontend/handlers/visit_handler.go
package handlers

import (
	"encoding/json"
	"net/http"

	"clinic-system/config"
)

type Visit struct {
	ID        int    `json:"id"`
	CreatedAt string `json:"created_at"`
}

func GetVisitsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := config.DB.Query("SELECT id, created_at FROM visits ORDER BY id DESC")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows.Close()

	visits := []Visit{}

	for rows.Next() {
		var v Visit
		rows.Scan(&v.ID, &v.CreatedAt)
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
	rows1, err := config.DB.Query("SELECT name FROM drugs WHERE visit_id=$1", visitID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows1.Close()

	for rows1.Next() {
		var d string
		rows1.Scan(&d)
		drugs = append(drugs, d)
	}

	// Tests
	rows2, err := config.DB.Query("SELECT test_name FROM lab_tests WHERE visit_id=$1", visitID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows2.Close()

	for rows2.Next() {
		var t string
		rows2.Scan(&t)
		tests = append(tests, t)
	}

	// Notes
	rows3, err := config.DB.Query("SELECT content FROM notes WHERE visit_id=$1", visitID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer rows3.Close()

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

func DeleteVisitHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")

	tx, err := config.DB.Begin()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	defer tx.Rollback()

	// Delete children first (safe even after fixing CASCADE)
	tx.Exec("DELETE FROM bills WHERE visit_id=$1", id)
	tx.Exec("DELETE FROM drugs WHERE visit_id=$1", id)
	tx.Exec("DELETE FROM lab_tests WHERE visit_id=$1", id)
	tx.Exec("DELETE FROM notes WHERE visit_id=$1", id)

	_, err = tx.Exec("DELETE FROM visits WHERE id=$1", id)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	if err := tx.Commit(); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "deleted successfully",
	})
}

func UpdateVisitHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	visitID := r.URL.Query().Get("id")

	var data struct {
		Notes []string `json:"notes"`
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	tx, err := config.DB.Begin()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// delete old notes
	_, err = tx.Exec("DELETE FROM notes WHERE visit_id=$1", visitID)
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), 500)
		return
	}

	// insert new notes
	for _, n := range data.Notes {
		_, err := tx.Exec("INSERT INTO notes (visit_id, content) VALUES ($1, $2)", visitID, n)
		if err != nil {
			tx.Rollback()
			http.Error(w, err.Error(), 500)
			return
		}
	}

	tx.Commit()

	json.NewEncoder(w).Encode(map[string]string{
		"message": "updated successfully",
	})
}
