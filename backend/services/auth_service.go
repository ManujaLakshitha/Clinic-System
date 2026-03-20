package services

import (
	"clinic-system/repository"

	"golang.org/x/crypto/bcrypt"
)

func Register(username, password string) error {
	// hash password
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	return repository.CreateUser(username, string(hashed))
}

func Login(username, password string) (int, error) {
	id, hashed, err := repository.GetUserByUsername(username)
	if err != nil {
		return 0, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
	if err != nil {
		return 0, err
	}

	return id, nil
}
