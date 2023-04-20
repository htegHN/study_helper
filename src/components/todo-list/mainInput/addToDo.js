
const addingToDoForm = document.querySelector(".todolist__adding-form");
const addingToDoInput = document.querySelector(".todolist__adding-form input");
const itemsForm = document.querySelector(".todolist__items-form");
const items = document.getElementById("todolist__items");

const TODOS_KEY = "todos";

let toDos = []; //const로 하면 parsed로 인해 변수가 변경되는 내용을 받지 못한다.

/**push 받은 toDos 배열 안의 object를 setItem을 이용해 localStorage에 저장하는 함수 */
const saveToDos = () => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}
/**todo를 지워주는 함수 */
const deleteToDo = (event, li) => {
    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    saveToDos();
}


window.addEventListener("storage", () => handleStorageChange(event)); 

/**localStorage에서 text를 바꿨을 때 todo input에 수정한 내용을 적용하는 함수 */
const handleStorageChange = (event) => {

     /* localStorage의 todos key에서 변화되었는지 확인*/
     if(event.key === "todos") {
       const oldValue = event.oldValue;
       const newValue = event.newValue; 
       const parsedOldValue = JSON.parse(oldValue);
       const parsedNewValue = JSON.parse(newValue);
       console.log(event.storageArea);
       for (let i = 0; i < parsedOldValue.length; i++) {
            /* text가 변화된 item을 추적 */ 
            if(parsedOldValue[i].text !== parsedNewValue[i].text) {
                const changedIndex = i;
                const newValueId = parsedNewValue[changedIndex].id.toString();
                const toDoLists = document.querySelectorAll("#todolist__items li"); 
                /*변경된 localStorage의 item과 아이디가 같은 li를 추적*/
                for (let j=0; j< toDoLists.length; j++) {
                    if (toDoLists[j].id === newValueId /*&& screenInputValue !== "undefined"*/) {
                    /*추적한 id를 가진 li의 input에 수정한 내용 적용 */
                    const screenInput = toDoLists[j].querySelector(".itemInput");
                    let screenInputValue = screenInput.value;
                    let newItemValue = parsedNewValue[changedIndex].text;
                    
                        /*ls에서 text 속성의 다른 부분을 건드리면 삭제되게 적용 */
                        if (screenInputValue === "undefined") {
                            deleteToDo(event, toDoLists[j]);
                            console.log(screenInputValue);
                         }
                         /*ls에서 text 앞뒤에 빈칸이 있을 경우 trim() 적용 */
                        else if (newItemValue.startsWith("") || newItemValue.endsWith("")) {
                            newItemValue = newItemValue.trim();
                            parsedNewValue[changedIndex].text = newItemValue;
                            screenInput.value = newItemValue;
                            localStorage.setItem(TODOS_KEY, JSON.stringify(parsedNewValue));
                        }
                    }
                }
            }
            /* text 이외의 변화된 item을 추적하여 삭제 */
            else if(oldValue !== newValue) {

             if ((JSON.stringify(parsedOldValue[i]))!== (JSON.stringify(parsedNewValue[i]))) { //객체는 다르므로 항상 true가 돼 문자열을 비교함
                console.log(JSON.stringify(parsedOldValue[i]));
                const changedIndex = i;
                const oldValueId = parsedOldValue[changedIndex].id.toString();
                const toDoLists = document.querySelectorAll("#todolist__items li");
                /*변경된 localStorage의 item과 아이디가 같은 li를 추적*/
                for (let i=0; i< toDoLists.length; i++) {
                    if (toDoLists[i].id === oldValueId) {
                    /*추적한 id를 가진 li를 삭제*/
                    deleteToDo (event, toDoLists[i]);
                    }
                }
             }
            }
    }
        }
    
     }


/**todo Input을 수정할 때 focusout event 발생 시 작성된 내용 저장 후 비활성화*/
const handleInputBlur = (event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon) => {
    event.preventDefault();
    const toDoLi = event.target.closest("li");
    const toDoLiId= toDoLi.id;
    const toDoInput = toDoLi.querySelector(".itemInput");
    const toDoInputValue = toDoInput.value.trim();
    const toDoIndex = toDos.findIndex(((item) => item.id === parseInt(toDoLiId))); 

    if (itemInput.value==false){
        alert("내용을 입력해주세요.")
        cancelEdit(itemInput, toDoIndex, itemEditBtnIcon, itemDeleteBtnIcon);
    }
    else {
    itemEditBtnIcon.innerText = "edit"
    itemDeleteBtnIcon.innerText = "delete";
    itemInput.disabled = true;

        /*event가 발생한 li.id로 ls의 해당 객체를 찾아 ls를 input 값의 value로 수정하기*/
        
        toDos[toDoIndex].text = toDoInputValue;
        saveToDos();
    }
}

/**edit button 클릭을 통해 todo input 수정 활성화 및 적용하는 함수 */
const handleEditBtnClick = (event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon) => {
    event.preventDefault();  
    const eventItemInput = event.target.parentElement.previousElementSibling;
    const focusedInput = document.querySelector(":focus");
    /*event가 실행되는 input과 다른 요소가 focus 되어있는 상태일 경우 중복 방지를 위해 event 취소*/
    if (focusedInput && focusedInput !==eventItemInput) {
      event.preventDefault();
       }
    
    /*event가 실행되는 input과 focus된 input이 동일하거나 focus가 된 요소가 없을 경우 실행 */
    else {
     if (!itemInput.disabled) {
        itemEditBtnIcon.innerText ="edit";  
        itemDeleteBtnIcon.innerText = "delete";
        
        /*toDos 배열에서 li.id로 해당 객체를 찾아 li 내부의 input 값의 value로 수정하기*/
        const toDoLi = event.target.closest("li");
        const toDoLiId= toDoLi.id;
        const toDoInput = toDoLi.querySelector(".itemInput");
        const toDoInputValue = toDoInput.value.trim();
        const toDoIndex = toDos.findIndex(((item) => item.id === parseInt(toDoLiId))); 
        //글자수를 만족하는지에 대한 조건문
        if(toDoInputValue == false) {
            alert("내용을 입력해주세요.");
            cancelEdit(itemInput, toDoIndex, itemEditBtnIcon, itemDeleteBtnIcon);
        }
        //글자수를 만족했을 때
        else { 
        itemInput.value = toDoInputValue;
        toDos[toDoIndex].text = toDoInputValue;
        saveToDos();
        itemInput.disabled = true;
        }}

        /*x 버튼을 눌렀을 때 이전값으로 돌아가게 해줌*/
     else {
        itemInput.disabled = false;
        itemInput.focus();
        itemEditBtnIcon.innerText ="done";
        itemDeleteBtnIcon.innerText = "close";
        itemInput.dataset.previousValue = itemInput.value;
        }}};
    

/**내용을 수정했을 때 빈칸일 경우 취소하고 원래값으로 되돌리는 함수 */
const cancelEdit = (itemInput, toDoIndex, itemEditBtnIcon, itemDeleteBtnIcon) => {
    const localStorageToDoText = toDos[toDoIndex].text;
    itemInput.value=localStorageToDoText

    itemInput.disabled = false;
    itemInput.focus();
    itemEditBtnIcon.innerText ="done";  
    itemDeleteBtnIcon.innerText = "close";
    }



/** Endter를 통해서도 todo input에 내용을 저장할 수 있게 만들어주는 함수*/
const handleEditBtnEnter = (event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon) => {

    if (event.key === "Enter") {
        event.preventDefault();
       
        itemEditBtnIcon.innerText ="edit";  
        itemDeleteBtnIcon.innerText = "delete";
        /*toDos 배열에서 li.id로 해당 객체를 찾아 li 내부의 input 값의 value로 수정하기*/
        const toDoLi = event.target.closest("li");
        const toDoLiId= toDoLi.id;
        const toDoInput = toDoLi.querySelector(".itemInput");
        const toDoInputValue = toDoInput.value.trim();
        const toDoIndex = toDos.findIndex(((item) => item.id === parseInt(toDoLiId))); 
        if(toDoInputValue==false) {
            alert("내용을 입력해주세요.");
            cancelEdit(itemInput, toDoIndex, itemEditBtnIcon, itemDeleteBtnIcon);
        }
        else {
        
        //toDos 라는 배열의 요소들 각각을 item이라 하는데 item 중 toDoLiId와 같은 id라는 요소를 찾아줌
        itemInput.value = toDoInputValue;
        toDos[toDoIndex].text = toDoInputValue;
        saveToDos();
        itemInput.disabled = true;
        }}
    }

    //enter 입력 시 error를 방지하기 위해 todo item의 submit을 방지
itemsForm.addEventListener("keydown", function(event) {
        if(event.keyCode === 13) {
            event.preventDefault();
        };
    });


/**Delete button을 눌렀을 때 이전 값으로 돌아가게 하거나 todo item을 지워주는 함수*/
const handleDeleteBtnClick = (event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon, newItem) => {
    event.preventDefault();
    if (itemDeleteBtnIcon.innerText !== "delete") {
        itemInput.disabled = true;
        itemEditBtnIcon.innerText = "edit"
        itemDeleteBtnIcon.innerText = "delete";
        itemInput.value = itemInput.dataset.previousValue;
        itemInput.dataset.previousValue = "";
    }
    else {
        deleteToDo(event, newItem);
    }
}

/**checkbox가 check 됐을 때 todo item의 style과 checked 된 상태를 localStorage에 저장하는 함수 */ 
const handleCheckboxChecked = (event, itemCheckbox, itemDiv, itemInput) => {
    if (itemCheckbox.checked) {
     
        itemDiv.classList.add("itemDiv--checked");
        itemInput.classList.add("itemInput--checked");
        const toDoLi = event.target.closest("li");
        const toDoLiId= toDoLi.id;
        const toDoIndex = toDos.findIndex(((item) => item.id === parseInt(toDoLiId))); 
        toDos[toDoIndex].checked = true;
        saveToDos();
        
    }   
    else {
    
        itemDiv.classList.remove("itemDiv--checked");
        itemInput.classList.remove("itemInput--checked");
        const toDoLi = event.target.closest("li");
        const toDoLiId= toDoLi.id;
        const toDoIndex = toDos.findIndex(((item) => item.id === parseInt(toDoLiId))); 
        toDos[toDoIndex].checked = false;
        saveToDos();
    }
};


/**Mouse가 checkbox에 hover 됐을 때 checkbox의 style을 변경해주는 함수 */
const handleMouseHover =(itemCheckboxIcon, isHover) => {
    if(isHover) {
    itemCheckboxIcon.classList.add("itemCheckboxIcon--hover");
    }
    else {
    itemCheckboxIcon.classList.remove("itemCheckboxIcon--hover");
}
};

const createToDoCheckbox = (newTodo, newItem, itemDiv, itemInput) => {
    const itemCheckboxLabel = document.createElement("label");
    itemCheckboxLabel.classList.add("itemCheckboxLabel");

    const itemCheckbox = document.createElement("input");
    itemCheckbox.type = "checkbox";
    itemCheckbox.setAttribute("id", "itemCheckboxId");
    itemCheckbox.classList.add("itemCheckbox");

    const itemCheckboxIcon = document.createElement("span");
    itemCheckboxIcon.classList.add("material-symbols-outlined", "itemCheckboxIcon");
    itemCheckboxIcon.innerText ="done";

    itemCheckboxLabel.appendChild(itemCheckbox);
    itemCheckboxLabel.appendChild(itemCheckboxIcon);
    newItem.appendChild(itemCheckboxLabel);


    if (newTodo.checked) {
        itemDiv.classList.add("itemDiv--checked");
        itemInput.classList.add("itemInput--checked");
        itemCheckbox.checked = true;
    }

    itemCheckbox.addEventListener("change", () => {
        handleCheckboxChecked(event, itemCheckbox, itemDiv, itemInput);
   })
    itemCheckboxLabel.addEventListener("mouseenter", ()=> handleMouseHover(itemCheckboxIcon, true));
    itemCheckboxLabel.addEventListener("mouseleave", ()=> handleMouseHover(itemCheckboxIcon, false));  
}


const createToDoContainer = (newTodo, newItem) => {

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("itemDiv");

    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.disabled = true;
    itemInput.value = newTodo.text;
    itemInput.classList.add("itemInput");
    itemInput.minLength = "1";
    itemInput.maxLength = "23";
    itemInput.required = "true"

    const itemEditBtn = document.createElement("button");
    itemEditBtn.classList.add("itemBtn--edit");

    const itemEditBtnIcon = document.createElement("span");
    itemEditBtnIcon.classList.add("material-symbols-outlined", "item__edit-btn");
    itemEditBtnIcon.innerText = "edit";
    itemEditBtn.appendChild(itemEditBtnIcon);

    const itemDeleteBtn = document.createElement("button");
    itemDeleteBtn.classList.add("itemBtn--delete");

    const itemDeleteBtnIcon = document.createElement("span");
    itemDeleteBtnIcon.classList.add("material-symbols-outlined", "item__delete-btn");
    itemDeleteBtnIcon.innerText = "delete";
    itemDeleteBtn.appendChild(itemDeleteBtnIcon);

    createToDoCheckbox(newTodo, newItem, itemDiv, itemInput);

    itemDiv.appendChild(itemInput);
    itemDiv.appendChild(itemEditBtn);
    itemDiv.appendChild(itemDeleteBtn);
    newItem.appendChild(itemDiv);
    items.appendChild(newItem);

    itemEditBtn.addEventListener("click", () => {
                handleEditBtnClick(event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon)});
    itemEditBtn.addEventListener("mousedown", (event) => { 
        /*input의 focus를 이용하기 위해 button의 focus를 막음 */
        event.preventDefault();
        itemEditBtn.blur();
    })
    itemInput.addEventListener("keyup", () => {
        handleEditBtnEnter(event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon)});
   itemInput.addEventListener("blur", () => {
        handleInputBlur(event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon);
    });
    itemDeleteBtn.addEventListener("click", () => {
        handleDeleteBtnClick(event, itemInput, itemEditBtnIcon, itemDeleteBtnIcon, newItem);}); 
    
}

/** todo를 화면에 그려주는 함수 */
const paintToDo = (newTodo) =>{
    const newItem = document.createElement("li");
    newItem.id =newTodo.id;
    createToDoContainer(newTodo, newItem);

}


/**addingToDoInput에서 submit이 발생했을 때 toDos 배열에 value와 localStorage에 toDos를 넣고
 * todo를 형성하는 함수 */
const handleSubmit = (event, inputData) =>{
    event.preventDefault();
    if (inputData.value==false){
        alert("내용을 입력해주세요.")
    }
    else {
    const newTodo = inputData.value.trim();
    inputData.value = "";
    const newToDoObj = { //object 형식으로 data를 저장해줌
        text:newTodo,
        id: Date.now(),
    }
    toDos.push(newToDoObj); //toDos 배열에 newTodoObj를 push 함
    paintToDo(newToDoObj);
    saveToDos();
    }
};

addingToDoForm.addEventListener("submit", (event) => handleSubmit(event, addingToDoInput));



/**toDos를 getItem을 이용해 localStorage에서 꺼내서 저장한 변수 */
const savedToDos = localStorage.getItem(TODOS_KEY);

if (savedToDos !== null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}