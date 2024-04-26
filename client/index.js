document.addEventListener('DOMContentLoaded',function (){
    fetch('http://localhost:5000/getALL')
    .then(response=>response.json())
    .then(data=>{
        // console.log(data)
        loadHTMLTable(data)});
});


const addBtn=document.querySelector('#add-button')
addBtn.onclick=function(){
    const nameInput=document.querySelector("#name-input")
    const name=nameInput.value;
    fetch('http://localhost:5000/insert',{
        headers:{
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify({name:name})
    })
    .then(response=>response.json())
    .then(data=>insertRowIntoTable(data))
}


function insertRowIntoTable(data){
    // console.log(data);
    const table=document.querySelector('table tbody')
    let tableHtml='<tr>';
    const isEmpty=document.querySelector('.no-data')
    for(var key in data){
        if(data.hasOwnProperty(key)){
            if(key==='date'){
                data[key]=new Date(data[key]).toLocaleDateString();
            }
            tableHtml+=`<td>${data[key]}</td>`
        }
    }
    tableHtml+=`<td><button class "delete-row-btn" data-id=${data.id}>Delete</td>`
    tableHtml+=`<td><button class="edit-row-btn" data-name=${data.name} data-id=${data.id}>Edit</td>`
    tableHtml+="</tr>"
    if(isEmpty){
        table.innerHTML=tableHtml
    }
    else{
        const row=table.insertRow();
        row.innerHTML=tableHtml;
    }
    location.reload();
}


const tbody=document.querySelector("table tbody").addEventListener('click',
function(event){
    if(event.target.className==="delete-row-btn"){
        deleteRow(event.target.dataset.id);
    }
    if(event.target.className==="edit-row-btn"){
        // console.log(event.target.dataset.name)
        updateRow(event.target.dataset.id,event.target.dataset.name);
    }
})


const deleteBtn=document.querySelector("delete-row-btn")
function deleteRow(id){
    fetch('http://localhost:5000/delete/'+id,{
        headers:{
            'Content-type':'application/json'
        },
        method:'DELETE'
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.success){
            location.reload();
        }
    })
}

function updateRow(id,oldName){
    const updateSection=document.querySelector('#update-row')
    updateSection.hidden=false;
    document.querySelector('#update-name-input').dataset.id=id
    document.querySelector('#update-name-input').value=oldName
}
const updateBtn=document.querySelector('#update-row-btn')
updateBtn.onclick=function(){
    // console.log(new Date().toLocaleDateString())
    const updatedRow=document.querySelector('#update-name-input')
    fetch('http://localhost:5000/update/'+updatedRow.dataset.id,{
        headers:{
            'Content-type':'application/json'
        },
        method:'PATCH',
        body:JSON.stringify({
            id:updatedRow.dataset.id,
            name:updatedRow.value
        })
    })
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                location.reload()
            }
        })
}

const searchBtn=document.querySelector('.search-btn')
searchBtn.onclick=function(){
    const name=document.querySelector('.search-input').value
    fetch('http://localhost:5000/search/'+name,{
        headers:{
            'Content-type':'application/json'
        },
        method:'GET'
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.success){
            loadHTMLTable(data)
        }
    })
}

function loadHTMLTable(data){
    const table=document.querySelector('table tbody');
    if(data.data.length === 0){
        table.innerHTML="<tr><td class='no-data' colspan='5'>No pending tasks</td></tr>";
        return;
    }
    let tableHtml=''
    data.data.forEach(({id,name,date_added}) => {
        tableHtml+="<tr>"
        tableHtml+=`<td>${id}</td>`
        tableHtml+=`<td>${name}</td>`
        tableHtml+=`<td>${new Date(date_added).toLocaleDateString()}</td>`
        tableHtml+=`<td><button class="delete-row-btn" data-id=${id}>Delete</td>`
        tableHtml+=`<td><button class="edit-row-btn" data-name=${name} data-id=${id}>Edit</td>`
        tableHtml+="</tr>"
    });
    table.innerHTML=tableHtml
    console.log(data)
}