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
- **Habits**: Erstellen, Anzeigen, Bearbeiten und Löschen von wiederkehrenden Gewohnheiten (täglich, wöchentlich, monatlich oder benutzerdefiniert)
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

### Body (JSON)
- `title` (string, required): Neuer Titel der Kategorie

### Beispiel-Request
```json
{
  "title": "Gesundheit & Sport"
}
```

### Beispiel-Response
```json
{
  "message": "Category updated successfully.",
  "category": {
    "id": 3,
    "title": "Gesundheit & Sport",
    "user_id": 5
  }
}
```
---
## Delete Category
Löscht eine Kategorie.

**Hinweis:** Eine Kategorie kann nur gelöscht werden wenn sie keinem Habit oder Journal mehr zugewiesen ist. Andernfalls wird eine Fehlermeldung zurückgegeben.

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
### Beispiel-Fehlermeldung
```json
{
  "message": "Category is still in use and cannot be deleted."
}
```
---

## Habits
---
## Get All Habits (Index)
Gibt alle Habits des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/habits

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
[
{
    "id": 1,
    "title": "Joggen",
    "category_id": 3,
    "user_id": 1,
    "frequency": "custom",
    "repeat_interval": 2,
    "custom_days": [
      "Monday",
      "Friday"
    ],
    "start_date": "2025-05-01T00:00:00.000000Z",
    "end_date": "2025-08-01T00:00:00.000000Z",
    "created_at": "2025-04-26T09:31:32.000000Z",
    "updated_at": "2025-04-26T10:07:18.000000Z"
  },
  {
    "id": 2,
    "title": "Meditieren",
    "category_id": 3,
    "user_id": 1,
    "frequency": "custom",
    "repeat_interval": 2,
    "custom_days": [
      "Monday",
      "Friday"
    ],
    "start_date": "2025-05-01T00:00:00.000000Z",
    "end_date": "2025-08-01T00:00:00.000000Z",
    "created_at": "2025-04-26T09:47:12.000000Z",
    "updated_at": "2025-04-26T09:47:12.000000Z"
  },
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
    "id": 1,
    "title": "Joggen",
    "category_id": 3,
    "user_id": 1,
    "frequency": "custom",
    "repeat_interval": 2,
    "custom_days": [
      "Monday",
      "Friday"
    ],
    "start_date": "2025-05-01T00:00:00.000000Z",
    "end_date": "2025-08-01T00:00:00.000000Z",
    "created_at": "2025-04-26T09:31:32.000000Z",
    "updated_at": "2025-04-26T10:07:18.000000Z"
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

### Body (JSON)
- `title` (string, required): Titel der Gewohnheit
- `category_id` (integer, required): ID der zugeordneten Kategorie
- `user_id`
- `frequency` (string, required): "daily", "weekly", "monthly", "custom"
- `repeat_interval` (integer, required): Wiederholungsintervall
- `custom_days` (array of strings, optional): Nur bei "custom", z. B. ["Monday", "Thursday"]
- `start_date` (string, required): Startdatum im Format YYYY-MM-DD
- `end_date` (string, optional): Enddatum im Format YYYY-MM-DD

**Hinweis:** Jedem Habit muss mindestens eine Kategorie zugewiesen werden. 


### Beispiel-Request
```json
{
  "title": "Take Vitamins",
  "category_id": 3,
  "frequency": "custom",
  "custom_type": "daily",
  "start_date": "2025-05-01",
  "end_date": "2025-06-01",
  "repeat_interval": 3
}
```

### Beispiel-Response
```json
{
  "message": "Habit created successfully",
  "habit": {
    "title": "Take Vitamins",
    "category_id": 3,
    "user_id": 1,
    "frequency": "custom",
    "start_date": "2025-05-01T00:00:00.000000Z",
    "end_date": "2025-06-01T00:00:00.000000Z",
    "repeat_interval": 3,
    "updated_at": "2025-04-26T10:05:51.000000Z",
    "created_at": "2025-04-26T10:05:51.000000Z",
    "id": 3
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
  "frequency": "custom",
  "custom_type": "weekly",
  "repeat_interval": 2,
  "custom_days": ["Monday", "Friday"],
  "start_date": "2025-05-01",
  "end_date": "2025-08-01"
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
    "category_id": 4,
    "user_id": 5
  },
  {
    "id": 2,
    "title": "Vorfreude",
    "entry": "Morgen fliege ich in die Ferien.",
    "category_id": 4,
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
    "category_id": 4,
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

### Body (JSON)
- `title` (string, required): Titel des Journals
- `entry` (string, required): Textinhalt des Eintrags
- `category_id` (integer, required): Zugeordnete Kategorie

**Hinweis:** Jedem Journal muss mindestens eine Kategorie zugewiesen werden.

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

