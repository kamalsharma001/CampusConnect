# CampusConnect 🎓

### Learn Together. Grow Together.

CampusConnect is a student skill exchange platform designed to encourage peer-to-peer learning within college communities. It allows students to share their existing skills, discover what others can teach, and connect with fellow students through mutual skill exchange.

The platform creates a collaborative learning environment where students can both teach and learn without relying entirely on traditional courses or external tutors.

## ✨ Features

- **Student Authentication:** Register and log in to the platform.
- **Profile Management:** Create, view, and update student profiles.
- **Skill Management:** Add and remove skills you can teach or want to learn.
- **Student Discovery:** Explore other students and their skill sets.
- **Mutual Skill Matching:** Discover students with compatible teaching and learning interests.
- **Skill Exchange Requests:** Send requests to students for knowledge exchange.
- **Request Management:** Accept or reject incoming skill exchange requests.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- Axios
- Vite

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Maven
- REST APIs

### Database
- PostgreSQL (or MySQL)

## 🔄 Application Workflow

1. Students register and log in to CampusConnect.
2. Students create their profiles and add skills they can teach.
3. Students select the skills they want to learn.
4. The matching service identifies students with mutual skill compatibility.
5. Students can send skill exchange requests to compatible peers.
6. Recipients can accept or reject incoming requests.

## 📁 Project Structure

```text
CampusConnect/
│
├── frontend/          # React.js user interface
│
├── backend/           # Spring Boot REST API
│
├── .gitignore         # Git ignored files
│
└── README.md          # Project documentation
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js and npm
- Java JDK
- Maven (or use the included Maven Wrapper)
- PostgreSQL Server (or MySQL Server)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CampusConnect
```

### 2. Configure the Database

- Start your PostgreSQL server.
- Create a database for the project (e.g. `campusconnect`).
- Configure the database connection details in the backend's `application.properties` file.
- Set the required environment variables (`DB_PASSWORD`).

### 3. Run the Backend

Navigate to the backend directory:

```bash
cd backend
```

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

### 4. Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## 🎯 Project Purpose

CampusConnect aims to build a collaborative student community where knowledge is shared through mutual learning. By connecting students who have different skills and learning interests, the platform promotes practical learning, knowledge exchange, and stronger connections within college communities.

## 👨‍💻 Author

**Kamal Sharma**

---

*CampusConnect – Learn Together. Grow Together.*
