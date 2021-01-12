import React from 'react';
import io from 'socket.io-client';
const socket = io('localhost:8000')

class App extends React.Component {

state = {
  tasks: [],
  taskData: {
    id: '',
    name: '',
  },
}

componentDidMount() {
  socket.on('updateData', (data) => this.setState({tasks: [...data]}))
  socket.on('addTask', (task) => this.setState({tasks: [...this.state.tasks, task]}))
  socket.on('removeTask', (id) => this.removeTask(id));
}

componentDidUpdate() {
  console.log(this.state)
}

removeTask(id, local) {
const {tasks} = this.state
const task = tasks.find(task => task.id === id)
const index = tasks.indexOf(task)
tasks.splice(index, 1)
this.setState({tasks: [...tasks]})

local && socket.emit('removeTask', index)
 

}

submitForm = (e) => {
  e.preventDefault()
  if(this.state.taskData.name.length > 0) {
    const newTask = {id: Date.now(), name: this.state.taskData.name}
    const taskArray = [...this.state.tasks]
    taskArray.push(newTask)
    this.setState({
      tasks: [...taskArray]
    })
    socket.emit('addTask', newTask)
  }
}

  render() {
    const {tasks} = this.state
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map((task) => { 
              return(<li key={task.id} className='task'>{task.name}<button onClick={(task) => this.removeTask(task.id, true)} className="btn btn--red">Remove</button></li>)
            })}
          </ul>
    
          <form id="add-task-form" onSubmit={(e)=>{this.submitForm(e)}}>
            <input value={this.state.taskData.name} onChange={(e) => this.setState({taskData: {...this.state.taskData, name: e.target.value}})} className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" />
            <button className="btn" type="submit">Add</button>
          </form>
        </section>
      </div>
    );
  };

};

export default App;