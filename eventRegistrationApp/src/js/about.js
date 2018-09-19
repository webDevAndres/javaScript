import './general';

export function initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 13,
      center: {lat: 59.325, lng: 18.070}
    });
  
    const marker = new google.maps.Marker({
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: {lat: 59.325, lng: 18.070}
    });
  
    marker.addListener('click', () => {
      infowindow.open(map,marker);
    });
  
    const infowindow = new google.maps.InfoWindow({
      content: `<h3>Event Location</h3><p>Event Address with all the contact details</p>`
    });
  
    infowindow.open(map,marker);
  }


// when the page has finished loading, a new script element will be created and stored in the $script
//      constant object.
// Then we add the src attribute to the $script object with the value of the required URL
//  Finally, we will append the script to the body element as a child
// In our ToDo List app, we created HTML elements by writing the HTML code directly in template strings. 
//      It is very efficient for constructing a large number of HTML elements. However, for smaller elements, 
//      it is better to use the document.createElement() method, since it makes the code more readable and easy
//       to understand when there are a lot of attributes to that element that need dynamic values.
window.addEventListener("load", () => {
    const $script = document.createElement('script');
    $script.src = `https://maps.googleapis.com/maps/api/js?key=${GMAP_KEY}&callback=bundle.initMap`;
    document.querySelector('body').appendChild($script);
  });