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
    this.refreshWeather()
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
      widgets:{}
    }

    this.toggleEditMode = this.toggleEditMode.bind(this);
  }

  initializeWigets(){

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



  render(){
    let mainContainerClasses = ['--mm-mainCanvas'];
    if(this.state.editMode) mainContainerClasses.push('--mm-editMode');

    return (
      <section className={mainContainerClasses.join(' ')}>
          <button onClick={this.toggleEditMode} className='--mm-editButton'></button>
      </section>
    )
  }

}

class BaseWidget extends React.Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  render(){
    return (
      'hallo welt'
    )
  }

}







const app = document.getElementById('app');
ReactDOM.render(<MagicMirror></MagicMirror>, app);
