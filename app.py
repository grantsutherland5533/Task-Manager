from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)
SAVE_FILE = "tasks.json"
SAVE_COLOR = 'color.json'

def load_tasks():
    if os.path.exists(SAVE_FILE):
        with open(SAVE_FILE, "r") as f:
            return json.load(f)
    return[]
    
def save_tasks(tasks):
    with open(SAVE_FILE, "w") as f:
        json.dump(tasks, f, indent=2)



tasks = load_tasks()


@app.route('/')
def home():
    return render_template('index.html', tasks=tasks)

@app.route('/tasks-json')
def tasks_json():
    return jsonify(tasks)

@app.route('/color', methods = ['GET', 'POST'])
def color():
    if request.method == 'POST':
        data = request.json
        color = data.get('color')
        with open('color.json', 'w') as f:
            json.dump({'color': color}, f)
        return jsonify({'status': 'saved'})
    elif os.path.exists(SAVE_COLOR):
        with open(SAVE_COLOR, 'r') as f:
            return jsonify(json.load(f))
    else:
        return jsonify({'color': 'white'})




@app.route('/add', methods = ['POST'])
def add_task():
    data = request.json
    task_title =  data.get("title")
    if task_title:
        task = {"title": task_title, "completed": False}
        tasks.append(task)
        save_tasks(tasks)
        return jsonify(task), 201
    return jsonify({"error": "No title provided"}), 400

@app.route('/update', methods = ["POST"])
def update_task():
    data = request.json
    index = data.get("index")
    completed = data.get("completed")
    if index is not None and 0 <= index < len(tasks):
        tasks[index]['completed'] = completed
        save_tasks(tasks)
        return jsonify(tasks[index]), 201
    return jsonify({"error": "Invalid index"}), 400

@app.route("/delete", methods = ["POST"])
def delete_task():
    data = request.json
    index = data.get("index")
    if index is not None and 0 <= index < len(tasks):
        removed = tasks.pop(index)
        save_tasks(tasks)
        return jsonify(removed)
    return jsonify({"error": "Invalid index"}), 400




if __name__ == '__main__':
    app.run(debug=True, port=0)