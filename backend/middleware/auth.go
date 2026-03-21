package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("mysecret")

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing token", 401)
			return
		}

		tokenStr := strings.Split(authHeader, " ")[1]

		_, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return secretKey, nil
		})

		if err != nil {
			http.Error(w, "invalid token", 401)
			return
		}

		next(w, r)
	}
}
