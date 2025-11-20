from flask import Flask, render_template, request, jsonify
import json
import os
import uuid

app = Flask(__name__)
SAVE_FILE = "tasks.json"
SAVE_COLOR = 'color.json'


    
def save_tasks(tasks):
    with open(SAVE_FILE, "w") as f:
        json.dump(tasks, f, indent=2)





@app.route('/')
def home():
    if os.path.exists(SAVE_FILE):
        with open(SAVE_FILE, 'r') as f:
            tasks = json.load(f)
    else:
        tasks = []
    return render_template('index.html', tasks=tasks)

@app.route('/tasks-json')
def tasks_json():
    with open(SAVE_FILE, 'r') as f:
        tasks = json.load(f)
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
        return jsonify({'color': 'black'})




@app.route('/add', methods = ['POST'])
def add_task():
    data = request.json
    task_title =  data.get("title")

    if os.path.exists(SAVE_FILE):

        with open(SAVE_FILE, 'r') as f:
            tasks = json.load(f)
    else:
        tasks = []
    if task_title:
        task = {
            "id": str(uuid.uuid4()),
            "title": task_title, 
            "completed": False}
        tasks.insert(0,task)
        save_tasks(tasks)
        return jsonify(task), 201
    return jsonify({"error": "No title provided"}), 400

@app.route('/reorder', methods = ['GET','POST'])
def reorder():
    
    if request.method == 'POST':
        data = request.json
        new_order = data.get('order',[])
        
        
        
        with open(SAVE_FILE, 'r') as f:
            tasks = json.load(f)
        
        reordered = []
        for tid in new_order:
            for task in tasks:
                if task['id']==tid:
                    reordered.append(task)
                    break
                
        
        with open(SAVE_FILE, 'w') as f:
            json.dump(reordered, f, indent=2)
        
        return jsonify({'status': 'success', 'new_order': new_order})
    elif request.method == 'GET':
        with open(SAVE_FILE, 'r') as f:
            tasks = json.load(f)
            return jsonify(tasks)






@app.route('/update', methods = ["POST"])
def update_task():
    data = request.json
    updated = False
    task_id = data.get("id")
    with open(SAVE_FILE, 'r') as f:
        tasks = json.load(f)
    completed = data.get("completed")
    if task_id:
        for task in tasks:
            if task['id'] == task_id:
                task['completed'] = completed
                updated_task = task
                updated = True
                break
                
        if not updated:
            return jsonify({"error": "Task not found"}), 404
        save_tasks(tasks)
        return jsonify(updated_task), 201
    

@app.route("/delete", methods = ["POST"])
def delete_task():
    data = request.json
    task_id = data.get("id")
    if not task_id:
        return jsonify({'error': 'No ID provided'}), 400
    with open(SAVE_FILE, 'r') as f:
        tasks = json.load(f)
    updated_tasks = [t for t in tasks if t['id'] != task_id]

    if len(updated_tasks) == len(tasks):
        return jsonify({'error': 'Task not found'}), 404
    
    save_tasks(updated_tasks)
    return jsonify({'status': 'success', "deleted_id": task_id}), 200

    
        
       





if __name__ == '__main__':
    app.run(debug=True, port=0)