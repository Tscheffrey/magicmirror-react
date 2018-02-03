class WeatherWidget extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      apiKey:"cc1132668106844791e358bf4fcf758b",
      placeQuery:"Obergrombach",
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


const app = document.getElementById('app');
ReactDOM.render(<WeatherWidget />, app);
