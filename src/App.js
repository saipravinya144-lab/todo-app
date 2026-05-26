import "./App.css";
import React,{useState,useEffect} from "react";
import axios from "axios";

export default function App(){

const [task,setTask]=useState("");
const [tasks,setTasks]=useState([]);
const [search,setSearch]=useState("");
const [filter,setFilter]=useState("all");

const [priority,setPriority]=useState("Medium");
const [dueDate,setDueDate]=useState("");

const [editId,setEditId]=useState(null);
const [editText,setEditText]=useState("");

const [darkMode,setDarkMode]=useState(false);

useEffect(()=>{
fetchTasks();
},[]);

const fetchTasks=async()=>{
try{
const response=
await axios.get(
"http://localhost:5000/tasks"
);

setTasks(response.data);

}catch(error){
console.log(error);
}
};

const addTask=async()=>{

if(!task.trim()) return;

try{

await axios.post(
"http://localhost:5000/tasks",
{
text:task,
done:false,
priority,
dueDate
}
);

setTask("");
setPriority("Medium");
setDueDate("");

fetchTasks();

}catch(error){
console.log(error);
}
};

const toggleTask=async(item)=>{

try{

await axios.put(
`http://localhost:5000/tasks/${item._id}`,
{
done:!item.done
}
);

fetchTasks();

}catch(error){
console.log(error);
}
};

const deleteTask=async(id)=>{

try{

await axios.delete(
`http://localhost:5000/tasks/${id}`
);

fetchTasks();

}catch(error){
console.log(error);
}
};

const clearAllTasks=async()=>{

try{

await axios.delete(
"http://localhost:5000/tasks"
);

fetchTasks();

}catch(error){
console.log(error);
}
};

const editTask=(item)=>{
setEditId(item._id);
setEditText(item.text);
};

const saveTask=async()=>{

try{

await axios.put(
`http://localhost:5000/tasks/${editId}`,
{
text:editText
}
);

setEditId(null);
setEditText("");

fetchTasks();

}catch(error){
console.log(error);
}
};

const completed=
tasks.filter(
(t)=>t.done
).length;

const progress=
tasks.length>0
?(completed/tasks.length)*100
:0;

return(

<div className={`container ${darkMode?"dark":""}`}>

<h1>
📝 My To-Do App
</h1>

<button
onClick={()=>
setDarkMode(
!darkMode
)
}
>
{darkMode?"☀ Light":"🌙 Dark"}
</button>

<input
value={task}
placeholder="Enter task"
onChange={(e)=>
setTask(
e.target.value
)
}
onKeyDown={(e)=>{
if(e.key==="Enter"){
addTask();
}
}}
/>

<select
value={priority}
onChange={(e)=>
setPriority(
e.target.value
)
}
>
<option>High</option>
<option>Medium</option>
<option>Low</option>
</select>

<input
type="date"
value={dueDate}
onChange={(e)=>
setDueDate(
e.target.value
)
}
/>

<button
className="add-btn"
onClick={addTask}
>
➕ Add
</button>

<button
className="delete-btn"
onClick={clearAllTasks}
>
🗑 Clear All
</button>

<input
placeholder="🔍 Search"
value={search}
onChange={(e)=>
setSearch(
e.target.value
)
}
/>

<p>
Total:{tasks.length}
</p>

<p>
Completed:{completed}
</p>

<p>
Pending:
{
tasks.filter(
(t)=>!t.done
).length
}
</p>

<div className="progress-container">
<div
className="progress-bar"
style={{
width:`${progress}%`
}}
></div>
</div>

<ul>

{tasks
.filter((item)=>{

const match=
item.text
.toLowerCase()
.includes(
search.toLowerCase()
);

if(!match)
return false;

if(filter==="completed")
return item.done;

if(filter==="pending")
return !item.done;

return true;

})

.map((item)=>(

<li key={item._id}>

{editId===item._id?

<>

<input
value={editText}
onChange={(e)=>
setEditText(
e.target.value
)
}
/>

<button
onClick={saveTask}
>
💾 Save
</button>

</>

:

<>

<span
onClick={()=>
toggleTask(item)
}
style={{
cursor:"pointer",
textDecoration:
item.done
?"line-through"
:"none"
}}
>
{item.text}
</span>

<p>
⭐ Priority:
{item.priority}
</p>

<p>
📅 Due:
{item.dueDate}
</p>

<button
className="edit-btn"
onClick={()=>
editTask(item)
}
>
✏ Edit
</button>

</>

}

<button
className="delete-btn"
onClick={()=>
deleteTask(
item._id
)
}
>
❌ Delete
</button>

</li>

))

}

</ul>

</div>

);

}