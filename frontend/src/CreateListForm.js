import React from 'react'

class CreateListForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listName: '',
    }
  }

  handleChange = event => {
    const {name, value} = event.target
    this.setState({[name]: value})
  }

  handleSubmit = event => {
    // Prevent the page from refreshing when the form is submitted
    event.preventDefault()

    // Send the data to the API
    fetch('http://localhost:8000/api/create-category/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.listName
      })
    })
    .then(response => {
      console.log(response)
      this.setState({listName: ''})
    })
  }
  
  render() {
    return (
      <React.Fragment>
        <form
          data-new-list-form
          onSubmit={this.handleSubmit}
        >
          <input
            // TODO: Still checking if these attributes are still necessary...
            // id="create-category-input"
            // aria-label="new list item"
            className="create-item"
            placeholder="new list item"
            type="text"
            name="listName"
            value={this.state.listName}
            onChange={this.handleChange}
          />
          <button
            // TODO: Still checking if these attributes are still necessary...
            // id="create-category-submit"
            // aria-label="new list item"
            className="btn"
          >
            +
          </button>
        </form>
      </React.Fragment>
    )
  }
}

export default CreateListForm
