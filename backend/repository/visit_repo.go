// backend/repository/visit_repo.go
package repository

import (
	"clinic-system/config"
)

func CreateVisit() (int, error) {
	var id int
	err := config.DB.QueryRow("INSERT INTO visits DEFAULT VALUES RETURNING id").Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, err
}

func SaveDrug(visitID int, drug string) error {
	_, err := config.DB.Exec(
		"INSERT INTO drugs (visit_id, name) VALUES ($1, $2)",
		visitID, drug,
	)
	return err
}

func SaveLabTest(visitID int, test string) error {
	_, err := config.DB.Exec(
		"INSERT INTO lab_tests (visit_id, test_name) VALUES ($1, $2)",
		visitID, test,
	)
	return err
}

func SaveNote(visitID int, note string) error {
	_, err := config.DB.Exec(
		"INSERT INTO notes (visit_id, content) VALUES ($1, $2)",
		visitID, note,
	)
	return err
}
