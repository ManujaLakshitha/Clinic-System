// backend/services/billing_service.go
package services

import (
	"clinic-system/config"
)

func CalculateBill(visitID int) (float64, error) {
	var total float64

	// Example pricing
	const drugPrice = 50
	const testPrice = 200

	var drugCount int
	var testCount int

	config.DB.QueryRow("SELECT COUNT(*) FROM drugs WHERE visit_id=$1", visitID).Scan(&drugCount)
	config.DB.QueryRow("SELECT COUNT(*) FROM lab_tests WHERE visit_id=$1", visitID).Scan(&testCount)

	total = float64(drugCount*drugPrice + testCount*testPrice)

	return total, nil
}

func SaveBill(visitID int, total float64) error {
	_, err := config.DB.Exec(
		"INSERT INTO bills (visit_id, total) VALUES ($1, $2)",
		visitID, total,
	)
	return err
}
