package services

import (
	"strings"

	"clinic-system/repository"
)

type ParseResponse struct {
	Drugs    []string
	LabTests []string
	Notes    []string
}

func ProcessAndSave(input string) error {
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

	// save to DB
	visitID, err := repository.CreateVisit()
	if err != nil {
		return err
	}

	for _, d := range result.Drugs {
		repository.SaveDrug(visitID, d)
	}

	for _, t := range result.LabTests {
		repository.SaveLabTest(visitID, t)
	}

	for _, n := range result.Notes {
		repository.SaveNote(visitID, n)
	}

	return nil
}
