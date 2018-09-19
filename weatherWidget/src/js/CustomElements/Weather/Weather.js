
import apiCall from './services/api/apiCall';

// skycons libray will ad a gloval variable, skycons to the window object
import './lib/skycons';


// All native HTML elements are implemented using the HTMLElement class(interface)
//      directly or through an interface that inherits it. So we need to create
//      a class that extends HTMLElement.
// By extending a class, we can inherit the properties and methods of the parent class.
class Weather extends HTMLElement {

  constructor() {
    // Note we have made a call to the super() method. What this does is call the constructor
    //      of the parent class HTMLElement. 
    // Whenever your class extends another class, always add super() inside your class's constructor.
    //      This way, the parent class will also get initialized before your class methods start working.
    super();

    // Generally, to access the shadow DOM of an element, you can use the shadowRoot property of that element.
    this.$shadowRoot = this.attachShadow({ mode: 'open' });

    // We also need to add HTML to ur custom element. Since the weather class is similar to the
    //      reference of a DOM element that we have used before, this.innerHTML can be used
    //      to add HTML for the weather element.
    this.$shadowRoot.innerHTML = `
        <style>
.weather-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  background-color: silver;
  justify-content: space-between;
}
.title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.details {
  flex: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.day-icon {
  flex: 1;
  max-height: 100%;
  max-width: 100%;
}
.text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.text-content {
  margin: 0px;
}
</style>
        <div class="weather-container">
        <div class="title">
          <h2 id="city">Loading...</h2>
        </div>
        <div class="details">
          <canvas id="dayIcon" class="day-icon"></canvas>
          <div class="text">
            <h2 class="text-content" id="temperature">--</h2>
            <p class="text-content" id="time">--</p>
            <p class="text-content" id="summary">--</p>
          </div>
        </div>
        </div>
        `;
  } // end constructor


  connectedCallback() {
    // The two class variables (properties), this.latitude and this.longitude, will get
    //      the value of the attributes lat and long from the custom weather element using the
    //      this.getAttribute() method.
    this.latitude = this.getAttribute('latitude');
    this.longitude = this.getAttribute('longitude');

    // we need to create refernces to the elements in the shadow DOM of the weather widget.
    this.$icon = this.$shadowRoot.querySelector('#dayIcon');
    this.$city = this.$shadowRoot.querySelector('#city');
    this.$temperature = this.$shadowRoot.querySelector('#temperature');
    this.$summary = this.$shadowRoot.querySelector('#summary');

    this.setWeather();

    this.ticker = setInterval(this.displayTime.bind(this), 1000);
  }

  disconnectedCallback() {
    clearInterval(this.ticker);
  }



  //setWeather() will first check whether both the latitude and longitude are available.
  //    Otherise it will be impossible to make the http request
  // Using the apiCall module, a GET request s amde and the response is availbale in the Promise.then() chain.
  // From the response of the HTTP request, the required data, such as the city name, tem, and summary
  //    are included in the respected DOm elements.
  // Fro the weather icon, the global Skycons variable is a constructor that creates an object with all the
  //    icons in a specired color. The instance of the constructor is stored in the skycons object.
  // for adding teh animated icon, we use the add method with the canvas element (this.$icon) as the first parameter
  //    and the icon name as the scond paramter int he requried format. 
  setWeather() {
    if(this.latitude && this.longitude) {
      apiCall(`getWeather/${this.latitude},${this.longitude}`, {}, 'GET')
        .then(response => {
          this.$city.textContent = response.city;
          this.$temperature.textContent = `${response.currently.temperature}° F`;
          this.$summary.textContent = response.currently.summary;
  
          const skycons = new Skycons({"color": "black"});
          skycons.add(this.$icon, Skycons[response.currently.icon.toUpperCase().replace(/-/g,"_")]);
          skycons.play();
        })
        .catch(console.error);
      }
    }

    // We first create a date object using the new Date() constructor. The new Date() constructor creates
    //    a date object with all the details regarding teh date and time passed as paramters.
    //    If no paramaters are passed, it will create an object containing all the information
    //    regarding the current date and time.
    // We get the hours, minutes, and seconds from the date object. Then by using the template strings,
    //    we construct the time in the required format and store it in the displayTime constant.
    // Finally, we set the time as the text content in the paragraph with the #time id in the shadow dom.
    displayTime() {
      const date = new Date();
      const displayTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const $time = this.$shadowRoot.querySelector('#time');
      $time.textContent = displayTime;
    }

    // To make the weather element respond to the changes in latitude and longitude, 
    //    we need to declare them as observed attributes.
    // This will create a static getter observedAttributes() that will return an array of 
    //    all the attribute names, for which the Weather Widget should listen for changes. 
    //    Static methods are special methods of Class that can be accessed without creating a
    //     class instance object. For all the other methods, we need to create a new instance 
    //    (object) of the class; otherwise, we won't be able to access them. Since static 
    //    methods do not need an instance, the this object will be undefined inside these methods.
    static get observedAttributes() {
      return ['latitude', 'longitude'];
    }

    // whenever the value of the latitude or longitude attribute changes, it updates
    //    the respective class variable and calls this.setWeather() to update the weather
    //    to the new geolocation.
    attributeChangedCallback(attr, oldValue, newValue) {
      if(attr === 'latitude' && oldValue !== newValue) {
        this.latitude = newValue;
        this.setWeather();
      }
      if(attr === 'longitude' && oldValue !== newValue) {
        this.longitude = newValue;
        this.setWeather();
      }
    }

    get long() {
      return this.longitude;
    }

    set long(long) {
    this.latitude = long;
    this.setWeather();
    }

    get lat() {
      this.latitude;
    }

    set lat(lat) {
      this.latitude = lat;
      this.setWeather();
    }

} // end class

// This will export the entire Weather class and make it available to be used inside other modules.
// We need to import this into our home.js file.
export default Weather;