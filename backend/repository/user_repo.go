package repository

import (
	"clinic-system/config"
)

func CreateUser(username, password string) error {
	_, err := config.DB.Exec(
		"INSERT INTO users (username, password) VALUES ($1, $2)",
		username, password,
	)
	return err
}

func GetUserByUsername(username string) (int, string, error) {
	var id int
	var hashedPassword string

	err := config.DB.QueryRow(
		"SELECT id, password FROM users WHERE username=$1",
		username,
	).Scan(&id, &hashedPassword)

	return id, hashedPassword, err
}
