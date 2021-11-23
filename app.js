var data = [];
var oneBeingEdited
var editMode = false
var loggedIn = false

var h2Element = document.querySelector("h2");

var userName = document.querySelector("#userName");
var loginButton = document.querySelector("#loginButton");
var registerButton = document.querySelector("#registerButton");

var editSubmitButton = document.querySelector("#editSubmitButton");
var    editFirstNameInputField = document.querySelector("#editFirstNameField");
var    editLastNameInputField = document.querySelector("#editLastNameField");
var    editScoreInputField = document.querySelector("#editScoreField");

var submitButton = document.querySelector("#submitButton");
var randomButton = document.querySelector("#randomButton");
var    firstNameInputField = document.querySelector("#firstNameField");
var    lastNameInputField = document.querySelector("#lastNameField");
var    scoreInputField = document.querySelector("#scoreField");
var connectionDropdown = document.querySelector("#connect");

var listOChampions = document.querySelector("#listOChampions");

function editSwitch(){
	if (loggedIn){
		editMode = !editMode;
		if (editMode){
			document.querySelectorAll('.editButtons').forEach(item => { item.style.display = 'inline';});
			document.querySelector('#editFields').style.display = 'block';
			document.querySelector('#inputFields').style.display = 'none';
		}else{
			document.querySelectorAll('.editButtons').forEach(item => { item.style.display = 'none';});
			document.querySelector('#editFields').style.display = 'none';
			document.querySelector('#inputFields').style.display = 'block';
		}
	}
}

function checkLogin(){
    fetch("https://dovish.herokuapp.com/users", {credentials: "include"}).then(rsp => {
        rsp.json().then(dat => {
			if (rsp.status == 200){
				data = dat;
				userName.innerHTML = "hello, "+data["firstname"];
				loggedIn = true;
				document.querySelectorAll('.editButtons').forEach(item => { item.style.display = 'none';});
				document.querySelector('#editFields').style.display = 'none';
				document.querySelector('#inputFields').style.display = 'block';
				editButton.style.display = 'block';
				return true;
			}
			else {
				loggedIn = false;
				document.querySelectorAll('.editButtons').forEach(item => { item.style.display = 'none';});
				document.querySelector('#editFields').style.display = 'none';
				document.querySelector('#inputFields').style.display = 'none';
				editButton.style.display = 'none';

				return false;
			}
        });
    });
}

function getId(){
    biggest = 0;
    for (i=0;i<data.length;i++){
        if (data[i]['id']>=biggest){
            biggest = data[i]['id']+1;
        }
    }
    return biggest;
}

function editItem(dbId){
    for (i=0;i<data.length;i++){
        if (data[i]['dbid']==dbId){
            editScoreInputField.value = data[i]['score']
            editFirstNameInputField.value = data[i]['firstname']
            editLastNameInputField.value = data[i]['lastname']
        }
    }
}

function addUser(email,firstName,lastName,password){
    var data = "email="+encodeURIComponent(id);
    data += "&firstName="+encodeURIComponent(firstName);
    data += "&lastName="+encodeURIComponent(lastName);
    data += "&password="+encodeURIComponent(score);
    fetch("https://dovish.herokuapp.com/users", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {"Content-Type":"application/x-www-form-urlencoded"}
    }).then(rsp => {
        loadServerData();
    });
}

function addToServerData(id,parentId,firstName,lastName,score){
    var data = "id="+encodeURIComponent(id);
    data += "&parentId="+encodeURIComponent(parentId);
    data += "&firstName="+encodeURIComponent(firstName);
    data += "&lastName="+encodeURIComponent(lastName);
    data += "&score="+encodeURIComponent(score);
    fetch("https://dovish.herokuapp.com/listData", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {"Content-Type":"application/x-www-form-urlencoded"}
    }).then(rsp => {
        loadServerData();
    });
}

function updateServerData(dbId,id,parentId,firstName,lastName,score){
    var data = "id="+encodeURIComponent(id);
    data += "&parentId="+encodeURIComponent(parentId);
    data += "&firstName="+encodeURIComponent(firstName);
    data += "&lastName="+encodeURIComponent(lastName);
    data += "&score="+encodeURIComponent(score);
    fetch(`https://dovish.herokuapp.com/listData/${dbId}`, {
        method: "PUT",
        credentials: "include",
        body: data,
        headers: {"Content-Type":"application/x-www-form-urlencoded"}
    }).then(rsp => {
        loadServerData();
    });
}

function deleteItem(dbId){
    fetch(`https://dovish.herokuapp.com/listData/${dbId}`, {method: "DELETE", credentials: "include"}).then(rsp => {
        loadServerData();
    });
}

function loadServerData(){
	checkLogin()
    fetch("https://dovish.herokuapp.com/listData", {credentials: "include"}).then(rsp => {
        rsp.json().then(dat => {
            data = dat;
            updateConnectionList();
            updateListOChampions();
        });
    });
}

function updateConnectionList(){
    connectionDropdown.options.length = 0;
    for (i=0;i<data.length;i++){
        var op = document.createElement("option");
        op.innerHTML = data[i].firstName;
        op.value = data[i].id;
        connectionDropdown.appendChild(op);
    };
};

function updateListOChampions(){
    listOChampions.innerHTML = "";
    for (let i=0;i<data.length;i++){
        var item = document.createElement("li");
        var name = document.createElement("div");
        name.innerHTML = data[i].firstName;
        let dbid = data[i]['dbid'];
        var editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.classList.add("editButtons");
        editButton.onclick = function() {
            oneBeingEdited = data[i];
            editItem(dbid);
        }
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "X";
        deleteButton.classList.add("editButtons");
        deleteButton.onclick = function() {
            if (confirm("are you sure you want to delete this item and all items bellow it?")){
                deleteItem(dbid);
            }
        }
        var sublis = document.createElement("ol");
        sublis.id = 'id'+data[i].id.toString();
        name.appendChild(editButton);
        name.appendChild(deleteButton);
        item.appendChild(name);
        item.appendChild(sublis);
        if (data[i].parentId == data[i].id){listOChampions.appendChild(item);}
        else {document.querySelector('#id'+data[i].parentId).appendChild(item);}
        editMode = true;
        editSwitch();
    };
    document.querySelectorAll('.editButtons').forEach(item => { item.style.display = 'none';});
    document.querySelector('#editFields').style.display = 'none';
};

function login(){
    let email = null;
    let password = null;
    while (email == null){
        email = prompt("Please enter your email:");
    }
    while (password == null){
        password = prompt("Please enter your password:");
    }
    var data = "email="+encodeURIComponent(email);
    data += "&password="+encodeURIComponent(password);
    fetch("https://dovish.herokuapp.com/sessions", {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {"Content-Type":"application/x-www-form-urlencoded"}
    }).then(rsp => {
        if (rsp.status == 201){
            loadServerData();
        }
        else{
        	alert("Unable to login");
		}
    });
}

function register(){
    let email = null;
    let password = null;
    let first = null;
    let last = null;
    while (email == null){
        email = prompt("Please enter your email:");
    }
    while (password == null){
        password = prompt("Please enter your password:");
    }
    while (first == null){
        first = prompt("Please enter your first name:");
    }
    while (last == null){
        last = prompt("Please enter your last name:");
    }
    var data = "email="+encodeURIComponent(email);
    data += "&password="+encodeURIComponent(password);
    data += "&firstName="+encodeURIComponent(first);
    data += "&lastName="+encodeURIComponent(last);
    fetch("https://dovish.herokuapp.com/users", { 
    	method: "POST",
        credentials: "include",
        body: data,
        headers: {"Content-Type":"application/x-www-form-urlencoded"}
    }).then(rsp => {
        if (rsp.status == 201){
            loadServerData();
        }
        else if (rsp.status == 422){
        	alert("email already in use.");
		}
		else{
        	alert("something went wrong.");
		}
    });
}

loginButton.onclick = function () {
    login();
};

registerButton.onclick = function () {
    register().then(rsp =>{
		loadServerData();
    });
};

editButton.onclick = function () {
    editSwitch();
};

editSubmitButton.onclick = function () {
    updateServerData(oneBeingEdited['dbid'],oneBeingEdited['id'],oneBeingEdited['parentid'],editFirstNameInputField.value,editLastNameInputField.value);
    editSwitch();
};

submitButton.onclick = function () {
    addToServerData(getId(),parseInt(connectionDropdown.value),firstNameInputField.value,lastNameInputField.value,parseFloat(scoreInputField.value));
    firstNameInputField.value = "";
    lastNameInputField.value = "";
    scoreInputField.value = "";
};

randomButton.onclick = function () {
    var rand = Math.floor(Math.random()*connectionDropdown.options.length);
    addToServerData(getId(),parseInt(connectionDropdown[rand].value),firstNameInputField.value,lastNameInputField.value,parseFloat(scoreInputField.value))
    firstNameInputField.value = "";
    lastNameInputField.value = "";
    scoreInputField.value = "";
};

loadServerData();
