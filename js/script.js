window.onload = function() {
    loadTheme();
    loadTasks();
};

//Chargement thème à l'arrivée sur la page
let item = JSON.parse(localStorage.getItem('themepref'));

function loadTheme(){
    if ( item === null) {
        console.log('cas null')
        return;
    }else{
        if(item === 'light'){
            console.log('cas light')
            return;
        }else{
            document.body.classList.toggle('light');
            document.body.classList.toggle('dark');
            console.log('cas dark')
        }
    }
};

//Theme sombre
function setTheme () {
    document.body.classList.toggle('light');
    document.body.classList.toggle('dark');
    if(document.body.classList.contains('dark')){
        document.querySelector('.color-theme').innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }else{
        document.querySelector('.color-theme').innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }

    //Ajout de la clé en fonction du thème lors du clique
    if(document.body.classList.contains('light')){
        localStorage.setItem('themepref', JSON.stringify('light'));
    }else{
        localStorage.setItem('themepref', JSON.stringify('dark'));
    }
    
};
document.querySelector('.color-theme').addEventListener('click', setTheme);


//Apparition ou non du bouton reset liste et de la barre des filtres
function loadFilters(){

    //Affichage de la barre des filtres et du bouton de reset de la liste
    const resetBtn = document.querySelector('.resetBtn');
    const filterBar = document.querySelector('.stat');
    const listItem = document.querySelector('.list-items');

    if(listItem.hasChildNodes()){
        resetBtn.style.display = 'block';
        filterBar.style.display = 'flex';
    }else{
        resetBtn.style.display = 'none';
        filterBar.style.display = 'none';
    };

    //Affichage du nombre de tâches restantes
    const listItemCompleted = listItem.querySelectorAll('.completed').length;
    const numberItems = document.querySelector('.Number-items');
    numberItems.innerHTML = `${listItem.childElementCount-listItemCompleted} tâche(s) restante(s)`;

    //Affichage du bouton de reset des tâches complétées
    const resetCompleted = document.querySelector('.resetCompleted');
    let allItems = document.querySelectorAll('.list-items .completed').length;
        if(allItems >= 1){
            resetCompleted.style.display = 'block';
        }else{
            resetCompleted.style.display = 'none';
        };
};


//Filtre des tâches Toutes - Actives - Terminées
function filtering(event){
   const clickedFilter = event.target.id;
   if (clickedFilter) {
    document.querySelector(".active-filter").classList.remove("active-filter");
    document.getElementById(clickedFilter).classList.add("active-filter");
    document.querySelector(".list-items").className = `list-items ${clickedFilter}`;
  }
}
document.querySelector('.filter').addEventListener('click',filtering);


//Reset de la liste
function resetTask (){
    localStorage.removeItem('tasks');
    location.reload();
};
document.getElementById('resetList').addEventListener('click', resetTask);


//Suppression des tâches complètes
function clearCompleted(){
    //On passe dans tous les éléments créés et on les affiche.
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    //Suppression des tâches terminées au chargement de la page
    for(let i=0;i<tasks.length;i++){
        if(tasks[i].completed === true)
        {
          tasks.splice(i,1);
        };
    };
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
};
document.getElementById('resetCompleted').addEventListener('click', clearCompleted);


//On prend les tâches dans le local storage et on les convertit en tableau.
function loadTasks(){
    let tasks = localStorage.getItem("tasks");
    if(!tasks){
        //Si il n'y a pas de tâche, pas la peine d'aller plus loin, ni de vérifier l'affichage des filtres.
        return tasks = null;
    }else{
        //On passe dans tous les éléments créés et on les affiche.
        tasks = Array.from(JSON.parse(tasks));
        tasks.forEach(task => {
            const list = document.querySelector('.list-items');
            const li = document.createElement('li');
            li.classList.add('item');
            li.innerHTML = 
            `<div class="task-bar">
                <i class="fa-regular" onclick="completedTask(this)"></i>
                <input class="task-bar-title" type="text" value="${task.name}" onfocus="getCurrentTask(this)" onblur="editTask(this)" disabled>
                <i class="fa-solid fa-pen-to-square" onclick="setFocus(this)"></i>
                <i class="far fa-trash-alt" onclick="deleteTask(this)"></i>
            </div>`;
            list.insertBefore(li, list.children[0]);

            //On vérifie sur la tâche est complétée ou non pour ajouter la classe de completion
            if(task.completed === true){
                li.classList.add("completed");
                document.querySelector('.fa-regular').classList.add("fa-circle-check");
            }else{
                document.querySelector('.fa-regular').classList.add("fa-circle");
            }
        });
        //On charge les filtres.
        loadFilters();


    };
};

//Fonction vérification de la validité de l'input et de la redondance ces tâches.
function addTask(){
    //On prend la valeur du champ input.
    let inputTask = document.getElementById('toDo').value;
    //Si rien n'est entré.
    if(inputTask === ''){
        return alert('Veuillez entrer une tâche !');
    }else{
        /*//Si c'est entré, vérifier si elle n'existe pas déjà.
        let savedTasks = localStorage.getItem("tasks");
        //Si il n'y a pas de tâche, passer directement à l'ajout.
        if(savedTasks === null){
            savedTasks = '';
        }else{
            //Si il y a des tâches, vérification de son éventuelle redondance.
            savedTasks = Array.from(JSON.parse(savedTasks));
            savedTasks.forEach(todo => {
                if (todo.task === inputTask) {
                    alert("Tâche déjà créée");
                    document.getElementById('toDo').value = '';
                    return;
                };
            });
        };*/

        //Ajout de la tâche dans le local storage.
        localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { name: document.getElementById('toDo').value, completed: false }]));
        //Création de la tâche en html
        const list = document.querySelector('.list-items');
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = 
        `<div class="task-bar">
            <i class="fa-regular fa-circle" onclick="completedTask(this)"></i>
            <input class="task-bar-title" type="text" value="${inputTask}" onfocus="getCurrentTask(this)" onblur="editTask(this)" disabled>
            <i class="fa-solid fa-pen-to-square" onclick="setFocus(this)"></i>
            <i class="far fa-trash-alt" onclick="deleteTask(this)"></i>
        </div>`;
        list.insertBefore(li, list.children[0]);

        //clear le champ input pour pouvoir entrer la prochaine valeur.
        document.getElementById('toDo').value = '';

        //On ajoute les filtres après ajout de la tâche
        loadFilters();
    };
};

document.getElementById('toDoForm').addEventListener('submit', e => {
    e.preventDefault();
    addTask();
});


//Suppression de l'élément*/
function deleteTask(event){
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    tasks.forEach(task => {
      if (task.name === event.parentNode.children[1].value) {
        // delete task
        tasks.splice(tasks.indexOf(task), 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.parentElement.parentElement.remove();

    //Vérification de l'affichage des filtres
    loadFilters();
};


//Tâche complétée 
function completedTask(event){
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    tasks.forEach(task => {
        //On affecte uniquement le changement sur l'élément cliqué qui coincide avec celui correspondant dans le localstorage
        if (task.name === event.nextElementSibling.value) {
            task.completed = !task.completed;
            if(task.completed){
                event.classList.add("fa-circle-check");
                event.classList.remove("fa-circle");
            }else{
                event.classList.add("fa-circle");
                event.classList.remove("fa-circle-check");
            }
        }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.parentElement.parentElement.classList.toggle('completed');
    //event.nextElementSibling.disabled = true;

    loadFilters();
};


//Édition de tâche
function setFocus(event){
    let allInputs = document.querySelectorAll('.task-bar-title');
    let itemInputField = event.previousElementSibling;

    allInputs.forEach(input => {
        if(input != itemInputField){
            input.classList.remove('editable');
        }else{
            itemInputField.classList.toggle('editable');
           itemInputField.disabled = !itemInputField.disabled;
            itemInputField.focus();
        }
    });
}

// store current task to track changes
let currentTask = null;

// get current task
function getCurrentTask(event) {
    currentTask = event.value;
}

function editTask(event){
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    // check if task is empty
    if (event.value === "") {
      alert("Task is empty!");
      event.value = currentTask;
      return;
    }
    // task already exist
    tasks.forEach(task => {
      if (task.name === event.value && task.name != currentTask) {
        alert("Task already exist!");
        event.value = currentTask;
        return;
      }
    });
    // update task
    tasks.forEach(task => {
      if (task.name === currentTask) {
        task.name = event.value;
      }
    });
    // update local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
};