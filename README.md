# Flask Task Manager

A full-stack task manager built with Flask (Python) and JavaScript, featuring asynchronous state management, custom drag-and-drop functionality, API-based frontend/backend communication, and a responsive UI.

## Features

- Dynamic creation, reading, updating, and deletion of tasks
- Custom drag-and-drop reordering with no external libraries
- Persistent state stored in a JSON backend
- Responsive UI for both mobile and desktop

## Tech Stack

- **Backend:** Python 3, Flask
- **Frontend:** HTML5, CSS3, JavaScript
- **Data Storage:** JSON file

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### 2. Set Up a Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the Application

```bash
python3 app.py
```

### 5. Access the Application

Open your browser and navigate to the URL displayed in the terminal (typically `http://localhost:5000`).

## Future Improvements

- Implementing user authentication
- Adding due dates and priority tags