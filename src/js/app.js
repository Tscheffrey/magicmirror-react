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
      text: 'First Widget'
      }
    });

    this.addWidget({
    type:BaseWidget,
    props:{
      text: 'Second Widget'
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
    this.state = {};
  }

  render(){
    return (
      <p>{this.props.text}</p>
    )
  }

}







const app = document.getElementById('app');
const magicmirror = <MagicMirror />;

ReactDOM.render(magicmirror, app);
