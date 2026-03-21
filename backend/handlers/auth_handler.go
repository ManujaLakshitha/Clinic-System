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

	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", 405)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "invalid request", 400)
		return
	}

	if data.Username == "" || data.Password == "" {
		http.Error(w, "missing fields", 400)
		return
	}

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

	if r.Method != http.MethodPost {
		http.Error(w, "method not allowed", 405)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "invalid request", 400)
		return
	}

	id, err := services.Login(data.Username, data.Password)
	if err != nil {
		http.Error(w, "invalid credentials", 401)
		return
	}

	token, err := services.GenerateToken(id)
	if err != nil {
		http.Error(w, "token error", 500)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"token":   token,
		"user_id": id,
	})
}
