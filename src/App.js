import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(list);
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "Please enter value");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "Task edited");
    } else {
      // Добавление новой задачи
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
      showAlert(true, "success", "Task added");
    }
  };

  // Очистка всех задач
  const clearList = () => {
    showAlert(true, "danger", "All tasks cleared");
    setList([]);
  };

  // Удаление задачи
  const removeItem = (id) => {
    showAlert(true, "danger", "Task removed");
    setList(list.filter((item) => item.id !== id));
  };

  // Редактирование задачи
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  // Сохранение списка задач в LocalStorage
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} />}
        <h3>Todo List</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. buy groceries"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
