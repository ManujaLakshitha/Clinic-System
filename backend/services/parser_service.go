// backend/services/parser_service.go
package services

import (
	"clinic-system/repository"
)

type ParseResponse struct {
	Drugs    []string
	LabTests []string
	Notes    []string
}

func ProcessAndSave(input string) (ParseResponse, int, error) {

	result, err := CallAI(input)
	if err != nil {
		return result, 0, err
	}

	visitID, err := repository.CreateVisit()
	if err != nil {
		return result, 0, err
	}

	for _, d := range result.Drugs {
		if err := repository.SaveDrug(visitID, d); err != nil {
			return result, 0, err
		}
	}

	for _, t := range result.LabTests {
		if err := repository.SaveLabTest(visitID, t); err != nil {
			return result, 0, err
		}
	}

	for _, n := range result.Notes {
		if err := repository.SaveNote(visitID, n); err != nil {
			return result, 0, err
		}
	}

	return result, visitID, nil
}
