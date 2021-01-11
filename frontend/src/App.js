import React, {useState, useEffect} from 'react'
import './assets/css/styles.css'
import CreateListForm from './CreateListForm'

function App() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/category-list/')
    .then(response => response.json())
    .then(result => {
      setCategories(result)
    })
  }, [categories])

  let categoryList = categories.map(category => <li key={category.id} className="category">{category.name}</li>)

  return (
    <React.Fragment>
      <h1 className="title">Stuff I need to do</h1>

      {/* lists */}
      <div className="categories">
        <h2 className="categories-title">My lists</h2>
        <ul className="categories-list">
          {categoryList}
        </ul>

        {/* List form */}
        <CreateListForm />
      </div>
    </React.Fragment>
  );
}

export default App;
