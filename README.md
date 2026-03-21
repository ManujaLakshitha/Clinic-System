# 🏥 AI-Powered Unified Clinic Notes & Billing System

## 📌 Overview

This project is a **full-stack AI-powered clinic management system** designed to simplify doctor workflows by allowing unified input of patient data.

Doctors can type or dictate notes, and the system will:

* Automatically classify **Drugs & Dosages**
* Identify **Lab Tests**
* Extract **Clinical Notes**
* Store structured data
* Generate bills
* Provide printable reports

---

## 🚀 Features

### ✅ AI-Based Classification

* Uses LLM (Groq API - Llama 3.3)
* Extracts structured JSON:

  * Drugs
  * Lab Tests
  * Notes

### ✅ Unified Input System

* Single input field for all clinical data
* No need for multiple forms/screens

### ✅ Editable Results

* Add / update / delete extracted items before saving

### ✅ Structured Database Storage

* PostgreSQL relational schema
* Proper normalization with relationships

### ✅ Billing System

* Calculates total cost based on:

  * Drugs
  * Lab tests

### ✅ Print Functionality

* Printable bill preview
* Clean UI for reports

---

## 🧠 Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | React + TypeScript          |
| Backend  | Golang                      |
| Database | PostgreSQL                  |
| AI       | Groq API (Llama 3.3)        |
| UI       | Tailwind CSS + Lucide Icons |

---

## 🏗️ System Architecture

```
React Frontend
      ↓
Golang Backend API
      ↓
AI Service (Groq API)
      ↓
PostgreSQL Database
```

---

## 🔄 Workflow

1. Doctor enters clinical text
2. Backend sends text to AI API
3. AI returns structured JSON
4. User reviews & edits results
5. Data saved into database
6. Bill is generated
7. User prints report

---

## 🗄️ Database Schema

### Tables:

* `visits`
* `drugs`
* `lab_tests`
* `notes`
* `drug_prices`
* `lab_test_prices`
* `users` (optional)

### Relationships:

* One visit → many drugs/tests/notes

---

## ⚙️ API Endpoints

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| POST   | `/process`       | Parse input using AI |
| POST   | `/save-visit`    | Save structured data |
| GET    | `/bill`          | Generate bill        |
| GET    | `/visits`        | Get all visits       |
| GET    | `/visit-details` | Get visit details    |
| DELETE | `/delete-visit`  | Delete visit         |
| PUT    | `/update-visit`  | Update visit         |

---

## 🧪 Example AI Output

### Input:

```
Patient has fever. Prescribe Paracetamol 500mg. Do CBC test.
```

### Output:

```json
{
  "drugs": ["Paracetamol 500mg"],
  "lab_tests": ["CBC"],
  "notes": ["Patient has fever"]
}
```

---

## 💰 Billing Logic

* Each drug/test has a predefined price
* Total = sum of all items

---

## 🖨️ Printing

* Bill preview modal
* Printable clean layout using browser print

---

## 🛠️ Setup Instructions

### 🔷 1. Clone Repository

```bash
git clone https://github.com/your-repo/clinic-system.git
cd clinic-system
```

---

### 🔷 2. Backend Setup (Golang)

```bash
cd backend
go mod tidy
go run main.go
```

Set environment variable:

```bash
export GROQ_API_KEY=your_api_key
```

---

### 🔷 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

---

### 🔷 4. Database Setup (PostgreSQL)

1. Create database:

```sql
CREATE DATABASE clinic_system;
```

2. Run provided SQL scripts

---

## ⚠️ Assumptions

* AI response is accurate
* Pricing is predefined
* Internet required for AI API

---

## ⚡ Limitations

* AI may misclassify edge cases
* No voice input (can be added)
* No drug interaction validation

---

## 💡 Future Improvements

* Voice input (Speech-to-Text)
* Drug interaction alerts
* Patient history tracking
* Advanced billing rules
* Export PDF reports

---

## 🏁 Conclusion

This system successfully demonstrates:

* AI-powered data extraction
* Clean full-stack architecture
* Efficient clinical workflow design
* Automated billing & reporting

---

## 👨‍💻 Author

**Software Engineer Manuja Lakshitha**

