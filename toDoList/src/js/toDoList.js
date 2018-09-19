
class ToDoClass {
    constructor() {
        // We are going to save our tasks in localStorage as a string with 'TASKS' as the key.
        //      So when the user opens the website for the first time, we need to check whether any data
        //      is present in localStorage with the key 'TASKS'.
        // If there is no data, it will return null, which means this is the first time the user is
        //      visiting the website.
        // We need to use JSON.parse() to convert the data from localStorage to an object.
        // If there is no data in localStorage we need to prepopulate with some data for our user to use
        //      using the tasks variable. The best place to add the code to persist task data is in the
        //      loadTasks() function because it is called everytime there is a change in tasks.
        // this.tasks means that the tasks variable belongs to this ( ToDoClass ).
        // The tasks variable is an array of objects that contain the details of the tasks
        //      and their completion status.
        this.tasks = JSON.parse(localStorage.getItem('TASKS'));
        if(!this.tasks) {
        this.tasks = [
            { task: 'Go to the Dentist', isComplete: false },
            { task: 'Do Gardening', isComplete: true },
            { task: 'Renew Library Account', isComplete: false },
        ];
    }
        // create a reference to the addTask DOM element in a variable inside our class.
        this.$pressEnter = document.getElementById('addTask');

        this.loadTasks();
        this.addEventListeners();
    
}

    // addEventListeners() listens for each keypress in the <input id="addTask"> element and runs the callback function
    //  The event object contains the keycode of the key that was pressed. The Enter keycode is 13,
    //      so, if the keycode is equal to 13 we call this.addTask() function and pass the event.target.value as a parameter.
    addEventListeners() {
        this.$pressEnter.addEventListener('keypress', event => {
            if (event.keyCode === 13) {
                this.addTask(event.target.value);
                event.target.value = '';
               
            }
        });
    }
    
    // The addTaskClick() method gets the input element that contains our text
    //      and assigns it to a variable called target.
    // The target variable now contains all the properties and methods of the input element
    // The value property contains the text that is put inside the input element, so
    //      we pass target.value to the addTask function which will handle adding the new
    //      task to the list
    // Once that is complete we reset the input field value to an empty state with ''
    addTaskClick() {
        let target = document.getElementById('addTask');
        this.addTask(target.value);
        target.value = "";
    }

    // In addTask(task) the task variable is passed to addTask as an argument. The task argument contains
    //      the text for the new task.
    // We first need to construct the JSON data that defines the new task, if the key and the value have the same name
    //      you can use object literal property value shorhand and instead of typing {task: task}, you can just type {task} once.
    // Then, we need to create another variable, called parentDiv that will store the object of the parent <div> element of
    //      our target <input>. To clarify, the parent element is the div that contains the input element.
    //      We do this because when the task is an empty string, we can add the has-error class to the parent element
    //      to render a red border around our input element.
    // If the input text is not empty, we remove the has-error class from the parent element then we push our newTask
    //      variable to the tasks variable that contains our array of tasks for our class.

    addTask(task) {
        let newTask = {
            task,
            isComplete: false,
        };
        let parentDiv = document.getElementById('addTask').parentElement;
        // console.log(parentDiv);
        if(task === '') {
            parentDiv.classList.add('has-error');
        }
        else {
            parentDiv.classList.remove('has-error');
            this.tasks.push(newTask);
            this.loadTasks();
            
        }
        // console.log(this.tasks);
    }


    // toggleTaskStatus(index) method marks a task as compelte or incomplete. it is called
    //      when a checkbox is clicked ( onChange event ) with the index of the task.
    // Using the task's index, we assign the task's isComplete status as the opposite of its current status
    //      using the ( ! ) operator. This way we can toggle the tasks completion status.
    // When the task variable is updated with the new data, this.loadTasks() is called to re-render all the
    //      tasks with the updated value.

    toggleTaskStatus(index) {
        this.tasks[index].isComplete = !this.tasks[index].isComplete;
         this.loadTasks();
       }

    // deleteTask(event, taskIndex) contains two paramters: event and taskIndex.
    // The first parameter event contains the entire event object that contains the various properties
    //      and methods about the click event that just happened.
    // To prevent any default action (opening a URL) from happening once, we click the delete icon (the <a> tag). 
    //      Initially, we need to specify event.preventDefault().
    // After that, we remove the task element of the array using the splice() method. The splice() method
    //      deletes a specified number of elements from an array using the index value of the element.
    //      So, we use the taskIndex parameter that bring in the starting index position of the element
    //          and the second parameter is where we want it to end.
    // Then we re-render the tasks using this.loadTasks() with the updated value.

    deleteTask(event, taskIndex) {
        event.preventDefault();
        this.tasks.splice(taskIndex, 1);
        this.loadTasks();
      }


    // The generateTaskHtml(task, index) method takes two arguments task and index.
    //      The task argument is an array element that contains a task in the tasks data and
    //      its index and returns a string that contains the html code for pupulating our tasks.
    // Inside our html we have added variables in our code for the checkbox, id="toggleTaskStatus".
    //      The onchange event says the that when the checkbox's status changes, call the toggleTaskStatus() method
    //      of the toDo object.
    //      We also used the conditional operator ()?: to return a checked attribute for the input tag if the task is complete
    // We have also included ${task.isComplete? 'complete' : '' } in the div that contains the text so that an additional class
    //      gets added to the task if the task is complete and renders a strike-through line over the text.
    // In the anchor tag <a class="" href="/" onClick="toDo.deleteTask(event, ${index})"></a> 
    //      we have included the onClick="toDo.deleteTask(event, ${index})" to call the deleteTask() method of the toDo object
    //      with parameters. The click event and the index of the task.
    generateTaskHtml(task, index) {
        return `
         <li class="list-group-item checkbox">
          <div class="row">
           <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 checkbox">
            <label><input id="toggleTaskStatus" type="checkbox" onchange="toDo.toggleTaskStatus(${index})" value="" class="" ${task.isComplete?'checked':''}></label>
           </div>
           <div class="col-md-10 col-xs-10 col-lg-10 col-sm-10 task-text ${task.isComplete?'complete':''}">${task.task}
          </div>
          <div class="col-md-1 col-xs-1 col-lg-1 col-sm-1 delete-icon-area">
            <a class="" href="/" onClick="toDo.deleteTask(event, ${index})"><i 
            id="deleteTask" data-id="${index}" class="delete-icon glyphicon 
            glyphicon-trash"></i></a>
           </div>
          </div>
         </li>
       `;
       }

    // we first declare a variable called let tasksHtml with a value that
    //       is returned by the callback function of the array reduce() method of the tasks variable.
    // reduce() applies a function to each element of an array from left to right and applies the values
    //       to an accumulator so that the array gets reduced to a single value. 
    //       Then it returns that final value.
    // The reduce() method accepts two paramters; first is the arrow function that
    //       will be applied to each element in an array. The second parameter is the initial value
    //       of the accumulator.
    // The first parameter of the reduce() method is the arrow function, (html, task, index) => html +=
    //       this.generateTaskHtml(task, index). 
    // As you can see the arrow function takes 3 paramters: html, task and index. html is the accumulator,
    //       task is an element from the tasks array, and index gives the current index of the array element
    //       in the iteration.
    // The arrow function takes the empty html string ( accumulator ) and concatenates it with the value
    //       returned by the generateTaskHtml() method of the ToDoClass, whose parameters are the first element
    //       of the array and its index. Then it repeats for all the elements in the task array with an updated
    //       value of the accumulator which is returned at the end of the iteration.
    // Then the reduce() method contains the entire HTML code for populating our tasks as a string.
    // The second parameter contains the initial value of the accumulator, html in our case. The initial html string
    //       is an empty string ''.
    //  localStorage.setItem('TASKS', JSON.stringify(this.tasks)) converts our tasks variable to a string and stores it
    //      in localStorage.
    loadTasks() {
        let tasksHtml = this.tasks.reduce((html, task, index) => html +=  
        this.generateTaskHtml(task, index), '');
        document.getElementById('taskList').innerHTML = tasksHtml;
        localStorage.setItem('TASKS', JSON.stringify(this.tasks));
       }
       
} //end class


let toDo; 

window.addEventListener("load", function() {
 toDo = new ToDoClass();;
  });
