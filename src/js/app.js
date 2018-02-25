class WeatherWidget extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      apiKey:"",
      placeQuery:"Bruchsal",
      hasResponse:false
    }

    this.onApiKeyChanged = this.onApiKeyChanged.bind(this);
    this.onPlaceChanged = this.onPlaceChanged.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.refreshWeather();
  }

  onApiKeyChanged(e){
    this.setState({apiKey:e.target.value});
  }

  onPlaceChanged(e){
    this.setState({placeQuery:e.target.value});
  }


  onSubmitForm(e){
    e.preventDefault();
    this.refreshWeather();
  }

  refreshWeather(){
    let url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&cnt=2&lang=de&q='
      + this.state.placeQuery + '&appid=' + this.state.apiKey;

    fetch(url)
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        this.setState({
          lastResponse:json,
          hasResponse:true
        })
      }.bind(this))
        .catch(function(error) {
        console.log('fetch failed: ', error)
      })

  }

  render(){
    let place;
    let temp;
    let weatherConditions;

    if(this.state.hasResponse){
      place = <p>Wetter für: {this.state.lastResponse.name}</p>
      temp = <h3>{this.state.lastResponse.main.temp + '°C'}</h3>;
      weatherConditions = <p>{this.state.lastResponse.weather[0].description}</p>;
    }

    return (
      <section>
        <form onSubmit={this.onSubmitForm}>
          <input placeholder="API Key" value={this.state.apiKey} onChange={this.onApiKeyChanged} required/>
          <input placeholder="Name of Place" value={this.state.placeQuery} onChange={this.onPlaceChanged} required/>
          <button>refresh</button>
        </form>
        {place}
        {temp}
        {weatherConditions}
      </section>
    )
  }

}



class MagicMirror extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editMode:false,
      widgets:{ }
    }
    this.widgetIdCounter = 10;
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.initializeWigets();
  }

  componentDidMount(){

  }

  initializeWigets(){
    this.addWidget({
    type:BaseWidget,
    props:{
      widgetName: 'Widget 1'
      }
    });

    this.addWidget({
    type:BaseWidget,
    props:{
      widgetName: 'Widget 2'
      }
    });
  }

  addWidget(widget){
    let widgetList = this.state.widgets;
    let id = this.generateWidgetId();
    widgetList[id] = widget;
    return id;
  }

  toggleEditMode(e){
    this.setState({editMode:!this.state.editMode});
  }

  setEditMode(e){
    this.setState({editMode:true});
  }

  unsetEditMode(e){
    this.setState({editMode:false});
  }

  generateWidgetId(){
    let id = this.widgetIdCounter;
    this.widgetIdCounter++;
    return id;
  }

  renderWidgets(){
    let renderedWidgets = [];
    for (var i in this.state.widgets) {
      let widget = this.state.widgets[i];
      let props = widget.props;
      props.key = i;
      props.canvasInEditMode = this.state.editMode;
      var element = React.createElement(widget.type,props,null);
      renderedWidgets.push(element);
    }

    return renderedWidgets;
  }


  render(){
    let mainContainerClasses = ['--mm-mainCanvas'];
    if(this.state.editMode) mainContainerClasses.push('--mm-editMode');

    return (
      <section className={mainContainerClasses.join(' ')}>
          <button onClick={this.toggleEditMode} className='--mm-editButton'></button>
            {this.renderWidgets()}
      </section>
    )
  }

}

class BaseWidget extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      settingsViewOpen:false,
      cssWidgetPrefix:"baseWidget",
      widgetName:"Standard Widget",
      placement:{
        height: 20,
        width:30,
        offsetX:0,
        offsetY:0,
        isBeingDragged:false
      }
    }
    if(props.widgetName) this.state.widgetName = props.widgetName;

    this.toggleSettings = this.toggleSettings.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(!nextProps.canvasInEditMode) this.setState({settingsViewOpen:false});
  }


  convertIntToRem(number){
    return number.toString() + 'rem';
  }

  toggleSettings(){
    this.setState({settingsViewOpen: !this.state.settingsViewOpen});
  }

  componentDidMount(){
    if(this.props.canvasInEditMode) this.initDraggable();
    else this.removeDraggable;
  }

  componentDidUpdate(prevProps, prevState){
    if(this.props.canvasInEditMode !== prevProps.canvasInEditMode){
      if(this.props.canvasInEditMode) this.initDraggable();
      else this.removeDraggable();
    }
  }

  initDraggable(){
    let draggableElement = this.domRef;

    this.interObj = interact(draggableElement).draggable({
      //allowFrom: '.drag-handle',
      restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      inertia: true,
      onstart: this.onDragStart.bind(this),
      onend:this.onDragEnd.bind(this),
      onmove:this.onDrag.bind(this)
      }
    );
  }

  removeDraggable(){
    this.interObj.draggable(false);
  }


  onDrag(e){
    let placement = this.state.placement;
    if(e.dx !== 0) placement.offsetX += e.dx;
    if(e.dy !== 0) placement.offsetY += e.dy;
    this.setState({placement});
  }

  onDragStart(){
    this.setState({isBeingDragged:true});
  }

  onDragEnd(){
    this.setState({isBeingDragged:false});
  }

  render(){
    let mainContainerClasses = ['--mm-widget'];
    if(this.state.cssWidgetPrefix) mainContainerClasses.push('--mm-' + this.state.cssWidgetPrefix);
    if(this.state.settingsViewOpen) mainContainerClasses.push('--mm-widget-flipped');
    if(this.state.isBeingDragged) mainContainerClasses.push('--mm-widget-isBeingDragged');

    let mainContainerStyle = {
      height: this.convertIntToRem(this.state.placement.height),
      width: this.convertIntToRem(this.state.placement.width),
      transform: 'translate(' + this.state.placement.offsetX  + 'px,' + this.state.placement.offsetY + 'px)'
    }

    if(this.state.editMode) mainContainerClasses.push('--mm-editMode');

    return (
      <div
        className={mainContainerClasses.join(' ')}
        style={mainContainerStyle}
        ref={(ref) => { this.domRef = ref; }} >
        <div className="--mm-widget-front">
          <p>content</p>
        </div>

        <div className="--mm-widget-back">
        </div>

        <div className="--mm-widget-nameTag">
          {this.state.widgetName}
        </div>

        <button onClick={this.toggleSettings} className='--mm-widget-settingsButton --mm-visible'></button>


      </div>
    )
  }

}







const app = document.getElementById('app');
const magicmirror = <MagicMirror />;

ReactDOM.render(magicmirror, app);
