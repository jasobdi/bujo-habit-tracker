# Habit Tracker API

## Übersicht

Diese REST API ermöglicht registrierten Benutzern die Verwaltung von:
- **Gewohnheiten** (Habits) mit flexiblen Wiederholungsregeln
- **Kategorien** zur besseren Organisation
- **Benutzerkonten und -daten** (Registrierung, Login, etc.)

Deferred Feature: Journaleinträge sind aktuell nur im Backend verfügbar und werden im Frontend noch nicht angezeigt oder bearbeitet. Siehe Abschnitt „Deferred Features“.

### Authentifizierung
Alle Endpoints ausser `register` und `login` erfordern einen gültigen **Bearer Token** im Header.

### Hauptfunktionen
- **Habits**: Erstellen, Anzeigen, Bearbeiten und Löschen von wiederkehrenden Gewohnheiten (täglich, wöchentlich, monatlich oder benutzerdefiniert)
- **Categories**: Erstellen, Anzeigen, Bearbeiten und Löschen von benutzerdefinierten Kategorien
- **User**: Registrierung, Login, Logout, Benutzerdaten bearbeiten und löschen

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
Loggt einen neuen Benutzer in der API ein.

### Endpoint
POST /api/login

### Body (JSON)
- `email` (string, required): E-Mail-Adresse
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
Loggt einen eingeloggten Nutzer wieder aus.

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

## Get Current User
Gibt die Informationen des aktuell eingeloggten Benutzers zurück.

**Hinweis:**Das Feld date_format wird derzeit im Frontend nicht angezeigt/verwendet.

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
PATCH /api/user

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
DELETE /api/user

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

## Get All Categories
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

## Show Category
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

**Hinweis:** Eine Kategorie kann nur gelöscht werden wenn sie keinem Habit mehr zugewiesen ist. Andernfalls wird eine Fehlermeldung zurückgegeben.

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

## Category Usage
Zeigt an, ob (und an wie vielen Stellen) eine Kategorie noch verwendet wird.

### Endpoint
GET /api/categories/{id}/usage

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
{
  "category_id": 3,
  "in_use": true,
  "usage": {
    "habits_count": 2
  }
}
```
**Hinweis:** Wenn in_use: true, blockiert DELETE /api/categories/{id} mit entsprechender Fehlermeldung.
---

## Habits

**Hinweis:** M:N Beziehung - Ein Habit kann mehreren Kategorien zugeordnet sein. Verwende daher category_ids (Array) anstelle von category_id.
---

## Get All Habits
Gibt alle Habits des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/habits

### Header
- Authorization: Bearer Token

### Beispiel-Response
```json
[
  {
    "id": 3,
    "title": "Pay Bills",
    "user_id": 1,
    "frequency": "monthly",
    "repeat_interval": 1,
    "custom_days": null,
    "start_date": "2025-01-25T00:00:00.000000Z",
    "end_date": null,
    "created_at": "2025-07-14T19:07:37.000000Z",
    "updated_at": "2025-07-14T19:07:37.000000Z",
    "active_dates": [
      "2025-07-01"
    ],
    "categories": [
      {
        "id": 4,
        "title": "Finance",
        "user_id": 1,
        "created_at": "2025-07-14T19:07:37.000000Z",
        "updated_at": "2025-07-14T19:07:37.000000Z",
        "pivot": {
          "habit_id": 3,
          "category_id": 4
        }
      }
    ]
  }
]
```
---

## Get Habits by Month
Gibt alle Habits des ausgewählten Monats zurück.

### Endpoint
GET /api/habits?year={YYYY}&month={MM}

### Header
- Authorization: Bearer Token

---

## Show Habit
Gibt eine ausgewählten Habit des aktuell eingeloggten Benutzers zurück.

### Endpoint
GET /api/habits/{id}

### Header
- Authorization: Bearer Token
---

## Create Habit
Erstellt einen neuen Habit.

### Endpoint
POST /api/habits

### Header
- Authorization: Bearer Token

### Body (JSON)
- `title` (string, required): Titel des Habits
- `category_ids` (integer, optional): ID der zugeordneten Kategorie aus der Pivot-Tabelle z. B. [2, 5]
- `user_id`
- `frequency` (string, required): "daily", "weekly", "monthly", "custom"
- `repeat_interval` (integer, required): Wiederholungsintervall, ist Standard 1 und kann bei "custom" angepasst werden (z.B. jede 2. Woche)
- `custom_days` (array of strings, optional): Nur bei "custom", z. B. ["Monday", "Thursday"], Werte von 0-6 für Wochentage
- `start_date` (string, required): Startdatum im Format YYYY-MM-DD
- `end_date` (string, optional): Enddatum im Format YYYY-MM-DD

**Hinweis:** Jedem Habit muss mindestens eine Kategorie zugewiesen werden. 

### Beispiel-Request
```json
{
  "title": "2h Programming",
  "category_ids": [5],
  "frequency": "weekly",
  "repeat_interval": 1,
  "custom_days": ["Saturday", "Sunday"],
  "start_date": "2025-04-30"
}
```
### Beispiel-Response
```json
{
  "message": "Habit created successfully",
  "habit": {
    "title": "2h Programming",
    "user_id": 1,
    "frequency": "weekly",
    "start_date": "2025-04-30T00:00:00.000000Z",
    "end_date": null,
    "repeat_interval": 1,
    "custom_days": [
      "Saturday",
      "Sunday"
    ],
    "updated_at": "2025-08-15T19:12:58.000000Z",
    "created_at": "2025-08-15T19:12:58.000000Z",
    "id": 46,
    "categories": [
      {
        "id": 5,
        "title": "Learning",
        "user_id": 1,
        "created_at": "2025-07-14T19:07:37.000000Z",
        "updated_at": "2025-07-14T19:07:37.000000Z",
        "pivot": {
          "habit_id": 46,
          "category_id": 5
        }
      }
    ]
  }
}
```
---

## Update Habit
Aktualisiert einen bestehenden Habit.

**Hinweis:**Einschränkung - start_date kann nach der Erstellung eines Habits nicht mehr angepasst werden.

### Endpoint
PATCH /api/habits/{id}

### Header
- Authorization: Bearer Token

### Body (JSON)
Mindestens eines dieser Felder:
- `title` (string, required): Titel des Habits
- `category_ids` (integer, optional): ID der zugeordneten Kategorie aus der Pivot-Tabelle z. B. [2, 5]
- `user_id`
- `frequency` (string, required): "daily", "weekly", "monthly", "custom"
- `repeat_interval` (integer, required): Wiederholungsintervall ist Standard 1 und kann bei "custom" angepasst werden (z.B. jede 2. Woche)
- `custom_days` (array of strings, optional): Nur bei "custom", z. B. ["Monday", "Thursday"], Werte von 0-6 für Wochentage
- `end_date` (string, optional): Enddatum im Format YYYY-MM-DD

### Beispiel-Request
```json
{
  "frequency": "custom",
  "custom_type": "weekly",
  "repeat_interval": 2,
  "custom_days": ["Monday", "Friday"],
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
Löscht einen Habit.

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

## Habit Completions (Checkboxen)
Diese Endpoints verwalten die Abhaken‑Zustände der Habits pro Datum.

**Wichtig:** Die API liefert Datumslisten; ein explizites completed‑Flag wird nicht zurückgegeben, dieses wird vom Frontend berechnet.
---

## Create Completion (abhaken)
Setzt einen Habit für ein Datum auf "erledigt".

### Endpoint
POST /api/habit-completions

### Header
- Authorization: Bearer Token

### Body (JSON)
- habit_id (integer, required)
- date (string, required) Format YYYY-MM-DD

### Beispiel-Request
```json
{
  "habit_id": 42,
  "date": "2025-08-15"
}
```
### Beispiel-Response
```json
{
  "habit_id": "3",
  "date": "2025-01-25",
  "updated_at": "2025-08-15T19:33:28.000000Z",
  "created_at": "2025-08-15T19:33:28.000000Z",
  "id": 325
}
```
---

## Get Daily Completions
Gibt alle Completions des Tages für den eingeloggten Nutzer zurück.

### Endpoint
GET /api/habit-completions/daily?year={YYYY}&month={MM}&day={DD}

### Header
- Authorization: Bearer Token

### Body (JSON)
- date (required) Format YYYY-MM-DD

### Beispiel-Response
```json
[
  {
    "id": 180,
    "habit_id": 7,
    "date": "2025-08-02",
  },
  {
    "id": 181,
    "habit_id": 8,
    "date": "2025-08-02",
  }
]
```
---

## Get Monthly Completions
Gibt alle Completions des Monats für den eingeloggten Nutzer zurück.

### Endpoint
GET /api/habit-completions/monthly?year{YYYY}&month{MM}

### Header
- Authorization: Bearer Token

### Body (JSON)
- month (required) z.B. 08 
- year (required) z. B. 2025

### Beispiel-Response
```json
[
  {
    "id": 180,
    "habit_id": 7,
    "date": "2025-08-02",
  },
  {
    "id": 181,
    "habit_id": 8,
    "date": "2025-08-02",
  },
  {
    "id": 195,
    "habit_id": 8,
    "date": "2025-08-07",
  },
  {
    "id": 204,
    "habit_id": 7,
    "date": "2025-08-07",
  }
]
```
---

## Delete Completion (abhaken rückgängig)
Entfernt den „erledigt“-Zustand von einem Habit für das ausgewählte Datum.

### Endpoint
DELETE /api/habit-completions

### Header
- Authorization: Bearer Token

### Body (JSON)
- habit_id (integer, required)
- date (string, required) Format YYYY-MM-DD

### Beispiel-Response
```json
{
  "message": "Habit completion deleted."
}
```
---

## Deferred Features - Journals
Die Endpoints sind vorhanden und mit Authentifizierung nutzbar, aber sie sind im Frontend noch nicht integriert.
---

## Get All Journals
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

## Show Journal
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

## Deferred Features - Users
---

## Show User by Id
Gibt die Informationen eines bestimmten Benutzers zurück -> nur für Admin gedacht.

### Endpoint
GET /api/users/{id}

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
