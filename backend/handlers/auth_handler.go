package handlers

import (
	"encoding/json"
	"net/http"

	"clinic-system/services"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var data struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	json.NewDecoder(r.Body).Decode(&data)

	err := services.Register(data.Username, data.Password)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "user created",
	})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var data struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	json.NewDecoder(r.Body).Decode(&data)

	id, err := services.Login(data.Username, data.Password)
	if err != nil {
		http.Error(w, "invalid credentials", 401)
		return
	}

	token, _ := services.GenerateToken(id)

	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}
