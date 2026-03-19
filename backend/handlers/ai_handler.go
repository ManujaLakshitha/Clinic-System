// backend/handlers/ai_handler.go
package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"clinic-system/config"
)

type ParseResponse struct {
	Drugs    []string `json:"drugs"`
	LabTests []string `json:"lab_tests"`
	Notes    []string `json:"notes"`
}

func saveToDB(data ParseResponse) {

	// 1. create visit
	var visitID int
	err := config.DB.QueryRow("INSERT INTO visits DEFAULT VALUES RETURNING id").Scan(&visitID)
	if err != nil {
		panic(err)
	}

	// 2. save drugs
	for _, drug := range data.Drugs {
		_, err := config.DB.Exec("INSERT INTO drugs (visit_id, name) VALUES ($1, $2)", visitID, drug)
		if err != nil {
			panic(err)
		}
	}

	// 3. save lab tests
	for _, test := range data.LabTests {
		_, err := config.DB.Exec("INSERT INTO lab_tests (visit_id, test_name) VALUES ($1, $2)", visitID, test)
		if err != nil {
			panic(err)
		}
	}

	// 4. save notes
	for _, note := range data.Notes {
		_, err := config.DB.Exec("INSERT INTO notes (visit_id, content) VALUES ($1, $2)", visitID, note)
		if err != nil {
			panic(err)
		}
	}
}

func ProcessHandler(w http.ResponseWriter, r *http.Request) {
	input := r.URL.Query().Get("text")

	result := ParseResponse{}

	words := strings.Split(input, ",")

	for _, word := range words {
		word = strings.TrimSpace(word)

		if strings.Contains(strings.ToLower(word), "mg") {
			result.Drugs = append(result.Drugs, word)
		} else if strings.Contains(strings.ToLower(word), "test") {
			result.LabTests = append(result.LabTests, word)
		} else {
			result.Notes = append(result.Notes, word)
		}
	}

	// 👉 DB save logic
	saveToDB(result)

	json.NewEncoder(w).Encode(result)
}
