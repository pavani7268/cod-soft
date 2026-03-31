from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# Configure SQLite Database
db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'todo.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Task Model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    priority = db.Column(db.String(20), default='Medium') # High, Medium, Low
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'completed': self.completed,
            'priority': self.priority,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

# Ensure Database is created
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([task.to_dict() for task in tasks])

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    
    new_task = Task(
        content=data['content'],
        priority=data.get('priority', 'Medium')
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    
    if 'completed' in data:
        task.completed = data['completed']
    if 'content' in data:
        task.content = data['content']
    if 'priority' in data:
        task.priority = data['priority']
        
    db.session.commit()
    return jsonify(task.to_dict())

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
