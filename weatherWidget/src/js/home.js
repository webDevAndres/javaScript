import '../css/styles.css';
import Weather from './CustomElements/Weather/Weather';
import 'webcomponents.js';

// This will call the getLocation function when the page completes loading
window.addEventListener('WebComponentsReady',  () => {
    // we used the customElements.define method to define our weather module.
    //  customElements in available on the global window object and accepts two parameters:
    //      The string of what the element will be called and the class that implements
    //      the custom element.
    customElements.define('x-weather', Weather);
    getLocation();
});

// First we need to check whether the navigator.geoLocation method is available in the browser
//      If it is available we can use the navigator.geoLocation.getCurrentPosition() method to
//      retrieve the user's geolocation.
// navigator.geolocation.getCurrentPosition() accepts two functions as parameters. The first function
//      will be called when the lcoation is retrieved successfully and teh second function is called
//      if the location cannot be retrieved.
 function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, errorPosition);
    }
    else {
        console.error("Geolocation is not supported by this browser");
    }
}

// The position object contains the latitude and longitude of the user in the position.coords property.
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // console.log(latitude);
    // console.log(longitude);

    // createWeatherElement function will return a weather element with three
    //      attributes and will look like the following:
    //      <x-weather latitude="13.0827" longitude="80.2707" class="small-widget"></x-weather>
    function createWeatherElement(className) {
        const $weather = document.createElement('x-weather');
        $weather.setAttribute('latitude', latitude);
        $weather.setAttribute('longitude', longitude);
        $weather.setAttribute('class', className);
        return $weather;
    };

    //To add the Weather Widget inside all the large, medium, and small containers
    //      we need to add the following code:
    const $largeContainer = document.querySelector('.large-container');
    const $mediumContainer = document.querySelector('.medium-container');
    const $smallContainer = document.querySelector('.small-container');

    $largeContainer.appendChild(createWeatherElement('large'));
    $mediumContainer.appendChild(createWeatherElement('medium'));
    // $smallContainer.appendChild(createWeatherElement('small'));

    const $small = createWeatherElement('small');
    $smallContainer.appendChild($small);
    setTimeout(() => {
      console.log($small.lat, $small.long);
      $small.lat = 51.5074;
      $small.long = 0.1278;
      console.log($small.lat, $small.long);
    }, 10000);
}

function errorPosition(error) {
    console.error(error);
}