package main

import (
	"encoding/json"
	"net/http"
	"strings"
)

type ParseResponse struct {
	Drugs    []string `json:"drugs"`
	LabTests []string `json:"lab_tests"`
	Notes    []string `json:"notes"`
}

func parseHandler(w http.ResponseWriter, r *http.Request) {
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

	json.NewEncoder(w).Encode(result)
}
