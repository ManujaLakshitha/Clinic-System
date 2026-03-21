package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type AIResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func CallAI(input string) (ParseResponse, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	apiURL := "https://api.groq.com/openai/v1/chat/completions"

	prompt := fmt.Sprintf(`
You are a highly accurate clinical assistant.

Extract data STRICTLY into JSON:

Rules:
- Drugs must include dosage (if available)
- Lab tests must be medical investigations only
- Notes must include symptoms, observations

Return ONLY JSON:

{
 "drugs": [],
 "lab_tests": [],
 "notes": []
}

Text: %s
`, input)

	bodyMap := map[string]interface{}{
		"model": "llama-3.3-70b-versatile",
		"messages": []map[string]interface{}{
			{"role": "user", "content": prompt},
		},
		"temperature": 0,

		"response_format": map[string]interface{}{
			"type": "json_object",
		},
	}

	bodyBytes, err := json.Marshal(bodyMap)
	if err != nil {
		return ParseResponse{}, err
	}

	req, _ := http.NewRequest("POST", apiURL, bytes.NewBuffer(bodyBytes))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return ParseResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		var errData interface{}
		json.NewDecoder(resp.Body).Decode(&errData)
		return ParseResponse{}, fmt.Errorf("Groq API error %d: %v", resp.StatusCode, errData)
	}

	var aiResp AIResponse
	if err := json.NewDecoder(resp.Body).Decode(&aiResp); err != nil {
		return ParseResponse{}, err
	}

	if len(aiResp.Choices) == 0 {
		return ParseResponse{}, fmt.Errorf("AI response empty")
	}

	content := aiResp.Choices[0].Message.Content

	var result ParseResponse

	if err := json.Unmarshal([]byte(content), &result); err != nil {
		return result, err
	}

	return result, nil
}
