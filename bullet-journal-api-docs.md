# Bullet Journal & Habit Tracker API

## Übersicht

Diese REST API ermöglicht registrierten Benutzern die Verwaltung von:
- **Journaleinträgen** (Tagebuch)
- **Gewohnheiten** (Habits) mit flexiblen Wiederholungsregeln
- **Kategorien** zur besseren Organisation
- **Benutzerkonten und -daten** (Registrierung, Login, etc.)

### Authentifizierung
Alle Endpoints ausser `register` und `login` erfordern einen gültigen **Bearer Token** im Header.

### Hauptfunktionen
- **Journals**: Erstellen, Anzeigen, Bearbeiten und Löschen von Einträgen
- **Habits**: Erstellen, Anzeigen, Bearbeiten und Löschen von iederkehrenden Gewohnheiten (täglich, wöchentlich, monatlich oder benutzerdefiniert)
- **Categories**: Erstellen, Anzeigen, Bearbeiten und Löschen von benutzerdefinierten Kategorien
- **User**: Registrierung, Login, Logout & Personalisierung 

### Antwortformat (Response)
Alle Responses sind im JSON-Format. Bei Fehlern wird eine Fehlermeldung zurückgegeben.

### Beispiel für eine Erfolgsmeldung:
```json
{
  "message": "Habit created successfully.",
  "habit": { ... }
}
```
### Beispiel für eine Fehlermeldung:
```json
{
  "error": "Unauthorized."
}
```

---
## Auth
---
## Register User
Registriert einen neuen Benutzer in der API.

### Endpoint
POST /api/register

### Body (JSON)
- `username` (string, required): Benutzername
- `email` (string, required): Gültige E-Mail-Adresse
- `password` (string, required): Passwort (wird gehasht)

### Beispiel-Request
```json
{
  "username": "test123",
  "email": "test@example.com",
  "password": "securePassword123",
}
```
### Beispiel-Response
```json
{
  "message": "User registered successfully.",
  "user": {
    "id": 5,
    "username": "test123",
    "email": "test@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOi..."
}
```
---
## Login User
Logt einen neuen Benutzer in der API ein.

### Endpoint
POST /api/login

### Body (JSON)
- `email` (string, required): Gültige E-Mail-Adresse
- `password` (string, required): Passwort (wird gehasht)

### Beispiel-Request
```json
{
  "email": "test@example.com",
  "password": "securePassword123",
}
```
### Beispiel-Response
```json
{
  "message": "Login successful",
  "user": {
    "id": 5,
    "username": "test123",
    "email": "test@example.com",
    "date_format": "dd/mm/yyyy",
    "created_at": "2025-03-23T16:33:28.000000Z",
    "updated_at": "2025-03-23T16:33:28.000000Z"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOi..."
}
```
---
## Logout User
Logt einen eingeloggten Nutzer wieder aus.

### Endpoint
POST /api/logout

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
{
  "message": "Logged out successfully"
}
```
---

## Users
---
## Get Current User (Index)
Gibt die Informationen des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/users

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
{
  "id": 5,
  "username": "test123",
  "email": "test@example.com",
  "date_format": "dd/mm/yyyy"
}
```
---
## Update User 
Aktualisiert die Benutzerinformationen des aktuell eingeloggten Benutzers.

### Endpoint
PATCH /api/users

### Header
- Authorization: Bearer Token

### Body (JSON)
Mindestens eines der folgenden Felder:
- `username` (string, optional): Neuer Benutzername
- `email` (string, optional): Neue E-Mail-Adresse
- `password` (string, optional): Neues Passwort (wird gehasht)
- `date_format` (string, optional): "dd/mm/yyyy", "mm/dd/yyyy" oder "yyyy/mm/dd"

### Beispiel-Request
```json
{
  "username": "neuerName",
  "date_format": "mm/dd/yyyy"
} 
```
### Beispiel-Response
```json
{
  "message": "User updated successfully.",
  "user": {
    "id": 5,
    "username": "neuerName",
    "email": "test@example.com",
    "date_format": "mm/dd/yyyy"
  }
} 
```
---
## Delete User
Löscht das aktuell eingeloggte Benutzerkonto unwiderruflich.

### Endpoint
DELETE /api/users/delete

### Header
Authorization: Bearer Token

### Beispiel-Response
```json
{
  "message": "User deleted successfully."
} 
```
---

## Categories
---
## Get All Categories (Index)
Gibt alle Kategorien des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/categories

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
[
  {
    "id": 1,
    "title": "Fitness",
    "user_id": 5
  },
  {
    "id": 2,
    "title": "Arbeit",
    "user_id": 5
  }
]
```
---
## Show Category (Index)
Gibt eine ausgewählte Kategorie des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/categories/{id}

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
{
  "id": 1,
  "title": "Fitness",
  "user_id": 5
}
```
---
## Create Category
Erstellt eine neue Kategorie.

### Endpoint
POST /api/categories

### Header
- Authorization: Bearer Token
- Content-Type: application/json

### Body (JSON)
- `title` (string, required): Titel der neuen Kategorie (z. B. "Gesundheit")

### Beispiel-Request
```json
{
  "title": "Gesundheit"
}
```

### Beispiel-Response
```json
{
  "message": "Category created successfully.",
  "category": {
    "id": 3,
    "title": "Gesundheit",
    "user_id": 5
  }
}
```
---
## Update Category
Aktualisiert eine vorhandene Kategorie.

### Endpoint
PATCH /api/categories/{id}

### Header
- Authorization: Bearer Token
- Content-Type: application/json

### Body (JSON)
- `title` (string, required): Neuer Titel der Kategorie

### Beispiel-Request
```json
{
  "title": "Gesundheit & Fitness"
}
```

### Beispiel-Response
```json
{
  "message": "Category updated successfully.",
  "category": {
    "id": 3,
    "title": "Gesundheit & Fitness",
    "user_id": 5
  }
}
```
---
## Delete Category
Löscht eine Kategorie.

### Endpoint
DELETE /api/categories/{id}

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
{
  "message": "Category deleted successfully."
}
```
---

## Habits
---
## Get All Habits (Index)
Gibt alle Gewohnheiten des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/habits

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
[
  {
    "id": 7,
    "title": "Joggen",
    "category_id": 1,
    "user_id": 5,
    "frequency": "weekly",
    "custom_days": ["Monday", "Thursday"],
    "start_date": "2025-03-01",
    "end_date": null,
    "repeat_interval": 1
  }
], [
  {
    "id": 4,
    "title": "Meditieren",
    "category_id": 1,
    "user_id": 5,
    "frequency": "daily",
    "custom_days": null,
    "start_date": "2025-03-31",
    "end_date": null,
    "repeat_interval": 1
  }
] 
```
---
## Show Habit (Index)
Gibt eine ausgewählte Gewohnheit des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/habits/{id}

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
[
  {
    "id": 7,
    "title": "Joggen",
    "category_id": 1,
    "user_id": 5,
    "frequency": "weekly",
    "custom_days": ["Monday", "Thursday"],
    "start_date": "2025-03-01",
    "end_date": null,
    "repeat_interval": 1
  }
]
```
---
## Create Habit
Erstellt eine neue Gewohnheit.

### Endpoint
POST /api/habits

### Header
- Authorization: Bearer Token
- Content-Type: application/json

### Body (JSON)
- `title` (string, required): Titel der Gewohnheit
- `category_id` (integer, required): ID der zugeordneten Kategorie
- `frequency` (string, required): "daily", "weekly", "monthly", "custom"
- `custom_days` (array of strings, optional): Nur bei "custom", z. B. ["Monday", "Thursday"]
- `start_date` (string, required): Startdatum im Format YYYY-MM-DD
- `end_date` (string, optional): Enddatum im Format YYYY-MM-DD
- `repeat_interval` (integer, required): Wiederholungsintervall

### Beispiel-Request
```json
{
  "title": "Meditation",
  "category_id": 1,
  "frequency": "daily",
  "custom_days": [],
  "start_date": "2025-03-24",
  "end_date": null,
  "repeat_interval": 1
}
```

### Beispiel-Response
```json
{
  "message": "Habit created successfully.",
  "habit": {
    "id": 10,
    "title": "Meditation",
    "category_id": 1,
    "user_id": 5,
    "frequency": "daily",
    "custom_days": [],
    "start_date": "2025-03-24",
    "end_date": null,
    "repeat_interval": 1
  }
}
```
---
## Update Habit
Aktualisiert eine bestehende Gewohnheit.

### Endpoint
PATCH /api/habits/{id}

### Header
- Authorization: Bearer Token
- Content-Type: application/json

### Body (JSON)
Mindestens eines dieser Felder:
- `title` (string, optional)
- `category_id` (integer, optional)
- `frequency` (string, optional)
- `custom_days` (array of strings, optional)
- `start_date` (string, optional)
- `end_date` (string, optional)
- `repeat_interval` (integer, optional)

### Beispiel-Request
```json
{
  "title": "Abendmeditation",
  "frequency": "weekly"
}
```

### Beispiel-Response
```json
{
  "message": "Habit updated successfully.",
  "habit": { ... }
}
```
---
## Delete Habit
Löscht eine Gewohnheit.

### Endpoint
DELETE /api/habits/{id}

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
{
  "message": "Habit deleted successfully."
}
```
---

## Journals
---
## Get All Journals (Index)
Gibt alle Journaleinträge des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/journals

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
[
  {
    "id": 1,
    "title": "Tagesrückblick",
    "entry": "Heute war ein produktiver Tag.",
    "category_id": 2,
    "user_id": 5
  },
  {
    "id": 2,
    "title": "Vorfreude",
    "entry": "Morgen fliege ich in die Ferien.",
    "category_id": 5,
    "user_id": 5
  }
]
```
---
## Show Journal (Index)
Gibt ein ausgewähltes Journal des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/journals/{id}

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
[
  {
    "id": 1,
    "title": "Tagesrückblick",
    "entry": "Heute war ein produktiver Tag.",
    "category_id": 2,
    "user_id": 5
  }
]
```
---
## Create Journal
Erstellt einen neuen Journaleintrag.

### Endpoint
POST /api/journals

### Header
- Authorization: Bearer Token
- Content-Type: application/json

### Body (JSON)
- `title` (string, required): Titel des Journals
- `entry` (string, required): Textinhalt des Eintrags
- `category_id` (integer, required): Zugeordnete Kategorie

### Beispiel-Request
```json
{
  "title": "Tagesrückblick",
  "entry": "Heute war ein produktiver Tag.",
  "category_id": 2
}
```

### Beispiel-Response
```json
{
  "message": "Journal created successfully.",
  "journal": { ... }
}
```
---
## Update Journal
Aktualisiert einen Journaleintrag.

### Endpoint
PATCH /api/journals/{id}

### Header
- Authorization: Bearer Token
- Content-Type: application/json

### Body (JSON)
Mindestens eines dieser Felder:
- `title` (string, optional)
- `entry` (string, optional)
- `category_id` (integer, optional)

### Beispiel-Request
```json
{
  "entry": "Ich habe heute viel gelernt."
}
```

### Beispiel-Response
```json
{
  "message": "Journal updated successfully.",
  "journal": { ... }
}
```
---
## Delete Journal
Löscht einen Journaleintrag.

### Endpoint
DELETE /api/journals/{id}

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
{
  "message": "Journal deleted successfully."
}
```
---

