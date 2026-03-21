// backend/services/parser_service.go
package services

type ParseResponse struct {
	Drugs    []string `json:"drugs"`
	LabTests []string `json:"lab_tests"`
	Notes    []string `json:"notes"`
}

func Process(input string) (ParseResponse, error) {
	return CallAI(input)
}
