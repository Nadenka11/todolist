import React from 'react';
import './App.css';
import ReactDOM from "react-dom";

let ItemsList = [];

class ToDoList extends React.Component {
  render() {
    var items = this.props.items.map((item, index) => {
      return (
          <ToDoListItem key={index} item={item} index={index} removeItem={this.props.removeItem}
                        markToDoDone={this.props.markToDoDone}/>
      );
    });
    return (
        <ul className="list-group"> {items} </ul>
    );
  }
}

class ToDoListItem extends React.Component {
  constructor(props) {
    super(props);
    this.onClickClose = this.onClickClose.bind(this);
    this.onClickDone = this.onClickDone.bind(this);
  }

  onClickClose() {
    let index = parseInt(this.props.index);
    this.props.removeItem(index);
  }

  onClickDone() {
    let index = parseInt(this.props.index);
    this.props.markToDoDone(index);
  }

  render() {
    let ToDoClass = this.props.item.done ?
        "done" : "undone";
    return (
        <li className="list-group-item " id={this.props.item.index}>
          <div className={ToDoClass}>
            <span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={this.onClickDone}></span>
            {this.props.item.value}
            <button type="button" className={ToDoClass === "done" ? "close" : "hidden"}
                    onClick={this.onClickClose}>&times;</button>
          </div>
        </li>
    );
  }
}

class ToDoForm extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleOptionChanged = this.handleOptionChanged.bind(this);
    this.state = {selectedOption: 'all'};
  }

  componentDidMount() {
    this.refs.itemName.focus();
  }

  onSubmit(event) {
    event.preventDefault();
    let newItemValue = this.refs.itemName.value;

    if (newItemValue) {
      this.props.addItem({newItemValue});
      this.refs.form.reset();
    }
  }

  handleOptionChanged(event) {
    this.setState({selectedOption: event.target.value})
  }

  render() {
    let countActive = 0;
    this.props.items.forEach((e) => {
      if (!e.done) countActive++;
    });

    let list = document.getElementsByClassName("list-group");
    if (list.item(0) != null) {
      let items = list.item(0).childNodes;
      items.forEach(e => {
        e.className = 'list-group-item '
      });
    }
    if (this.state.selectedOption === 'active') {
      this.props.items.forEach((e) => {
        if (e.done) {
          document.getElementById(e.index).className = "hidden";
        }
      });
    } else if (this.state.selectedOption === 'completed') {
      this.props.items.forEach((e) => {
        if (!e.done) {
          document.getElementById(e.index).className = "hidden";
        }
      });
    }
    return (
        <div>
          <form ref="form" onSubmit={this.onSubmit} className="form-inline">
            <input type="text" ref="itemName" className="form-control" placeholder="New task"/>
            <button type="submit" className="btn btn-default">Add task</button>
            <div/>
            <div className="radio">
              <label>
                <input type="radio" value="all" checked={this.state.selectedOption === 'all'}
                       onChange={this.handleOptionChanged}/>
                All
              </label>
            </div>
            <div/>
            <div className="radio">
              <label>
                <input type="radio" value="active" checked={this.state.selectedOption === 'active'}
                       onChange={this.handleOptionChanged}/>
                Active
              </label>
            </div>
            <div/>
            <div className="radio">
              <label>
                <input type="radio" value="completed"
                       checked={this.state.selectedOption === 'completed'}
                       onChange={this.handleOptionChanged}/>
                Completed
              </label>
            </div>
          </form>
          <label>{countActive} aren't complete</label>
        </div>
    );
  }
}

class ToDoHeader extends React.Component
{
  render(){
    return (<h1> ToDoList </h1>);
  }
}
class ToDoApp extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.markToDoDone = this.markToDoDone.bind(this);
    this.state = {ItemsList: ItemsList};
  }

  addItem(ToDoItem) {
    ItemsList.unshift({
      index: ItemsList.length + 1,
      value: ToDoItem.newItemValue,
      done: false
    });
    this.setState({ItemsList: ItemsList});
  }

  removeItem(itemIndex) {
    ItemsList.splice(itemIndex, 1);
    this.setState({ItemsList: ItemsList});
  }

  markToDoDone(itemIndex) {
    let ToDo = ItemsList[itemIndex];
    ItemsList.splice(itemIndex, 1);
    ToDo.done = !ToDo.done;
    ToDo.done ? ItemsList.push(ToDo) : ItemsList.unshift(ToDo);
    this.setState({ItemsList: ItemsList});
  }

  render() {
    return (
        <div id="main">
          <ToDoHeader/>
          <ToDoList items={this.props.initItems} removeItem={this.removeItem} markToDoDone={this.markToDoDone}/>
          <ToDoForm addItem={this.addItem} items={this.state.ItemsList}/>
        </div>
    );
  }
}

ReactDOM.render(<ToDoApp initItems={ItemsList}/>, document.getElementById('root'));

export default ToDoApp;
