var maxZIndex= 100;

var Note = React.createClass({
  getInitialState() {
    return {editing: false};
  },
  
  componentWillMount() {
    this.style = {
      right: this.randomBetween(0, window.innerWidth - 150) + 'px', 
      top: this.randomBetween(0, window.innerHeight - 150) + 'px',
      transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'
    };
  },
  
  componentDidMount() {
    $(ReactDOM.findDOMNode(this)).css("z-index", maxZIndex);
    if(!Modernizr.touchevents) {
      $(ReactDOM.findDOMNode(this)).draggable({
        containment: "parent",
        start: function(event, ui) {
          maxZIndex++;
          $(this).css("z-index", maxZIndex);
        },
        distance: 10,
        cancel: "span, textarea"
      });
    }
  },
  
  randomBetween(min, max) {
    return(min + Math.ceil(Math.random() * max));
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
  
  activate() {
    if(Modernizr.touchevents) {
      maxZIndex++;
      $(ReactDOM.findDOMNode(this)).css("z-index", maxZIndex);
    }
  },
  
  renderDisplay() {
    return (
      <div className="note" style={this.style} onClick={this.activate}>
        <p>{this.props.children}</p>
        <span>
          <button onClick={this.edit} className="btn btn-edit glyphicon glyphicon-pencil" />
          <button onClick={this.remove} className="btn btn-delete glyphicon glyphicon-trash" />
        </span>
      </div>
    );
  },
  
  renderForm() {
    return (
      <div className="note" style={this.style}>
        <textarea ref="newText" defaultValue={this.props.children} className="form-control"></textarea>
        <button onClick={this.save} className="btn btn-save btn-sm glyphicon glyphicon-menu-down" />
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
  
  getInitialState() {
    return {
      notes: []
    };
  },
  
  nextId() {
    this.uniqueId = this.uniqueId || 0;
    //each new note will take a new uniqueId
    return this.uniqueId++;
  },
  
  componentWillMount() {
    var self = this;
    if(this.props.count) {
      $.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" + this.props.count + "&start-with-lorem=1&callback=?", function(results) {
        results[0].split('. ').forEach(function(sentence){
          self.add(sentence.substring(0,30));
        });
      });
    }
  },
  
  add(text) {
    maxZIndex++;
    var arr = this.state.notes;
    //add new note's text to the array
    arr.push({
      id: this.nextId(),
      note: text
    });
    this.setState({notes: arr});
  },
  
  update(newText, i) {
    //store the state of notes
    var arr = this.state.notes;
    //set new text and attach the new Id to the text
    arr[i].note = newText;
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
      <Note key={note.id}
        index={i}
        onChange={this.update}
        onRemove={this.remove}
      >
        {note.note}
      </Note>
    );
  },
  
  render() {
    return (<div className="board">
        {this.state.notes.map(this.eachNote)}
        <button className="btn btn-add glyphicon glyphicon-plus" onClick={this.add.bind(null, "New Note")} />
      </div>
    );
  }
});

ReactDOM.render(<Board count={40} />, document.getElementById('react-container'));