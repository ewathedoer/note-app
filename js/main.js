var Note = React.createClass({
  getInitialState() {
    return {editing: false};
  },
  
  edit() {
    this.setState({editing: true});
  },
  
  save() {
    //var val= this.refs.newText.value;
    this.props.onChange(this.refs.newText.value, this.props.index);
    this.setState({editing: false});
  },
  
  remove() {
    this.props.onRemove(this.props.index);
  },
  
  renderDisplay() {
    return (
      <div className="note">
        <p>{this.props.children}</p>
        <span>
          <button onClick={this.edit} className="btn btn-primary glyphicon glyphicon-pencil" />
          <button onClick={this.remove} className="btn btn-danger glyphicon glyphicon-trash" />
        </span>
      </div>
    );
  },
  
  renderForm() {
    return (
      <div className="note">
        <textarea ref="newText" defaultValue={this.props.children} className="form-control"></textarea>
        <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
      </div>
    );
  },
  
  render() {
    if (this.state.editing) {
      return this.renderForm();
    } else {
      return this.renderDisplay();
    }
  }
});

var Board = React.createClass({
  propTypes: {
    count(props, propName) {
      if (typeof props[propName] !== "number") {
        return new Error ('The count must be a number');
      }
      if (props[propName] > 100) {
        return new Error ('Creating ' + props[propName] +  ' is not the best choice in this app');
      }
    }
  },
  
  add(text) {
    var arr = this.state.notes;
    //add new note's text to the array
    arr.push(text);
    this.setState({notes: arr});
  },
  
  getInitialState() {
    return {
      notes: []
    };
  },
  
  update(newText, i) {
    //store the state of notes
    var arr = this.state.notes;
    //set new text
    arr[i] = newText;
    //update the state of notes array
    this.setState({notes:arr});
  },
  
  remove(i) {
    var arr = this.state.notes;
    //remove the one item from the array
    arr.splice(i, 1);
    //update the state of the array
    this.setState({notes: arr});
  },
  
  eachNote(note, i) {
    return(
      <Note key={i}
        index={i}
        onChange={this.update}
        onRemove={this.remove}
      >
        {note}
      </Note>
    );
  },
  
  render() {
    return (<div className="board">
        {this.state.notes.map(this.eachNote)}
        <button className="btn btn-sm btn-success glyphicon glyphicon-plus" onClick={this.add.bind(null, "New Note")} />
      </div>
    );
  }
});

ReactDOM.render(<Board count={10} />, document.getElementById('react-container'));