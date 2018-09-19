import './general';
import SimpleWebRTC from 'simplewebrtc';


// localVideoEl contains tshe ID of the elements that should contain your local video.
//      In our case the video#localVideo element from our index file is going to display
//      our own video.
// remoteVideosEl contains the Id of teh container that contains the videos that need to be
//      added.
// autorequestMedia is used to prompt the user to give permission to access the camera and microphone
//      and needs to be sets to true.
//  debug if true will print all the webrtc events in the console.
const webrtc = new SimpleWebRTC({
    localVideoEl: 'localVideo',
    remoteVideosEl: '',
    autoRequestMedia: true,
    debug: false,
});

class Home {
    //  store references to DOM elements
    constructor() {
        this.roomName = '';

        this.$createRoomSection = document.querySelector('#createRoomSection');
        this.$createRoomButton = document.querySelector('#createRoom');
        this.$roomNameInput = document.querySelector('#roomNameInput');

        this.$infoSection = document.querySelector('#infoSection');
        this.$roomName = document.querySelector('#roomNameText');
        this.$roomUrl = document.querySelector('#roomUrl');
        this.$buttonArea = document.querySelector('.room-text');
        this.$copy = document.querySelector('.copy');
        this.$copied = document.querySelector('.copied');

        this.$remotes = document.querySelector('.video-area');
        this.$localVideo = document.querySelector('#localVideo');

        this.registerClicks();
        this.addEventListeners();
    } // end constructor

    // registerClicks registers click events
    // When the user clicks the createRoomButton, the room name that is typed
    //      in the input field will be converted into URL-friendly characters
    //      using regular expressions.
    // If the room name is not empty, webrtc.createRoom() will create the room.
    // webrtc.createRoom() accepts two paramters: the room name string and the callback function
    //      that executes when the room is created.
    // the callback function has the paramters err and name. We also need to check
    //      if the process is a success with another if statement. 
    registerClicks() {
        this.$createRoomButton.onclick = () => {
            this.roomName = this.$roomNameInput.value.toLowerCase()
                .replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
            if (this.roomName) {
                webrtc.createRoom(this.roomName, (err, name) => {
                    if (!err) {
                        // room created
                        // The location object contains information regarding the current URL
                        // location.pathname is used to set or get the current URL of the web page,
                        // So, we can construct a url by appending the room name to it. 
                        // To replace the URL without affecting the current page, we can us the history object
                        //      provided by the History Web API. The history object is used to manipulate
                        //      the browser's history.
                        // For such complex actions, you can use the pushState() and replaceState() methods 
                        //      introduced in HTML5 for the history object. pushState() creates a new history 
                        //      entry on the browser and changes the URL of the page without affecting the current page.
                        //       replaceState() does the same, but instead of creating a new history entry, it 
                        //      replaces the current entry, making it ideal for our purpose.
                        // Both the pushState() and replaceState() methods accept three parameters. 
                        //      The first one is state (a JSON object), the second one is title (string),
                        //       and the third one is the new URL. 
                        const newUrl = location.pathname + '?' + name;
                        history.replaceState({}, '', newUrl);
                        this.roomName = name;
                        this.roomCreated();
                    }
                    else {
                        //unable to create room
                        console.error(err);
                    }
                });
            }
        }
        // clicking on the copy and copied button will call the copyUrl() method
        this.$copy.onclick = () => {
            this.copyUrl();
        };
        this.$copied.onclick = () => {
            this.copyUrl();
        };

        // This adds the required classes to the video element and its parent div.
        // For remote videos, we cannot register clicks here becuase we create those elements dynamically.
        this.$localVideo.onclick = () => {
            this.clearSelected();
            this.$localVideo.parentElement.classList.add('container-selected');
            this.$localVideo.classList.add('video-selected');
        };
    }

    // To copy text, first, we need to get a range of nodes (the DOM elements) from which 
    //      we need to copy text. To do so, create a range object and select the this.$roomUrl node, 
    //      which contains the text of the room URL. 
    // The range object contains the element $roommUrl as the selected node. Then we need to select
    //      the text in the node.
    // The window object has the getSelection() method, which can be used for this purpose. To do this
    //      we need to remove all the ranges to clear the previous selections and then select a new
    //      range ( which is the range object we created previously).
    // Finally, we don't know whether the user's browser supports executing the copy command, 
    //      so we do the copying inside a try{} catch(err){} statement so that, if any error occurs, 
    //      it can be handled in the catch statement. The document.execCommand('copy') method will 
    //      copy the text in the selected range and return it as a string. Also, we need to hide 
    //      the copy button and display the copied button when, as copy is successful.
    // At the end of the copyUrl() method window.getSelection().removeAllRanges()
    //      clears the selection, so next time you click copy, the room URL text will not be highlighted.
    copyUrl() {
        const range = document.createRange();
        range.selectNode(this.$roomUrl);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unseccessful';
            console.log('Copying text command was ' + msg);
            this.$copy.classList.add('hidden');
            this.$copied.classList.remove('hidden');
        }
        catch (err) {
            console.error(err);
        }
        window.getSelection().removeAllRanges();
    }

    // Since the room has been created and the URL has been changed, 
    //      we need to hide the .create-room-area div and display the 
    //      .info-area div instead.
    // roomCreated() method will show the information section while hiding
    //      the create room section. 
    // The room name and URL will be changed with the textContent() method,
    //      which changes the text that is present in the respective DOM element.
    roomCreated() {
        this.$infoSection.classList.remove('hidden');
        this.$createRoomSection.classList.add('hidden');
        this.$roomName.textContent = `Room Name: ${this.roomName}`;
        this.$roomUrl.textContent = window.location.href;
    }


    //  whenever the mouse enters a div, it will fire a mouseenter event.
    //      when this happens in the $buttonArea, we need to remove the .hidden class from the copy button.
    //      We also need the button to be hidden when the pointer leaves div, so we use the mouseout event.
    // The e object contains the target element, so we need to check whether e exists, and if it does,
    //      we need to check whether its parent element or the element itself is $buttonArea.
    //      If it is true we simply return, this way the callback function stops exectuing without hiding
    //      the copy and copied buttons.
    // We hide the copied button too becuase we are going to make it visible when the user clicks the copy button.
    addEventListeners() {
        this.$buttonArea.addEventListener('mouseenter', () => {
            this.$copy.classList.remove('hidden');
        });
        this.$buttonArea.addEventListener('mouseout', event => {
            const e = event.toElement || event.relatedTarget;
            if (e) {
                if (e.parentNode == this.$buttonArea || e == this.$buttonArea) {
                    return;
                }
            }
            this.$copy.classList.add('hidden');
            this.$copied.classList.add('hidden');
        });


    }

    // Setters are special methods that are used for assigning a new value to the object's property.
    // We will create a setter method for our Home class to join a room. To create a setter simply
    //      create a method prefixed with the set keyword and the method should have EXACTLY ONE
    //      parameter.
    set room(room) {
        webrtc.joinRoom(room);
        this.roomName = room;
        this.roomCreated();
    }

    // To create a getter simply prefix the method with the get keyword with no paramters
    //      and it should return a value.
    // In our case, our Home class needs to kow the room name using the getter.
    get room() {
        return this.roomName;
    }

    // We first need to create a div element using the document.createElement('div) method
    //      and assign it to the $container object.
    // Then we set the class name of $container to 'video-container' and the ID
    //      to 'container_peerid'.
    // We get the peer ID from the peer object we recieved using the webrtc.getDOmId() method.
    // The $video object we received is an HTML element just like $container and we append
    //      $container as a child inside this.$remotes
    // What this does is construct the HTML we need with the classes and Ids. So, When a user leaves
    //      the room, the videoRemoved event will be fired, similar to the videoAdded event.

    addRemoteVideo($video, peer) {
        const $container = document.createElement('div');
        $container.className = 'video-container';
        $container.id = 'container_' + webrtc.getDomId(peer);

        $video.className = 'video-player';
        $container.appendChild($video);
        this.$remotes.appendChild($container);

        $video.onclick = () => {
            this.clearSelected();
            $container.classList.add('container-selected');
            $video.classList.add('video-selected');
        }
    }

    // Whenever the user leaves the room, we need to use the peer ID to remove the div
    //      containing the ID ('container_peerid') of the user who left.
    // removeRemoteVideo(peer) method will find the div containing the remote video using
    //      the peer ID and will remove it from this this.$remotes object using the removeCHild()
    //      method.
    removeRemoteVideo(peer) {
        const $removedVideo = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'no-video-found');
        if ($removedVideo) {
            this.$remotes.removeChild($removedVideo);
        }
    }

    // clearSelected() finds the video containing the .video-selected class and removes
    //      the .video-selected class from that video and the .container-selected class
    //      from that video's parent div.
    clearSelected() {
        let $selectedVideo = document.querySelector('.video-selected');
        if($selectedVideo) {
            $selectedVideo.classList.remove('video-selected');
            $selectedVideo.parentElement.classList.remove('container-selected');
        }
    }


} // end class

const home = new Home();

// We are using SimpleWebRTCs readtToCall event that is fired when it has finished loading.
//      We also use the on method to listen for events that are fired.
// We use the readyToCall event to check for the room name in the URL.
// If the URL does not contain the query string, location.serach will be an emtpy string,
//      which is a falsy value.
// If the Url does contain the query string with the room name, the lcoaiton.serach will return
//      '?roomName', which is a truthy value, so the net statement location.search.split('?')[1]
//      gets evaluated, which splits and returns the first index array (room name).
// The search property sets or returns the querystring part of a URL, including the question mark (?)
//      The querystring part is the part of the URL after the question mark (?). 
//      This is often used for parameter passing.
// The split() method splits the string into an array of substrings divided by the value
//      passed to it as a parameter.
// So, location.search.split('?') will convert the string into an array as follows:
//      [ '', 'myRoom']
// webrtc.joinRoom(room) adds the user to the room.

webrtc.on('readyToCall', () => {
    const room = location.search && location.search.split('?')[1];
    if (room) home.room = room;
});

// Whenever a video gets added, it will call the addRemoveVideo method of the Home class
//      with the video object and the peer object.
// we have a .video-area div with contains all our videos, So we need to create another div
//      inside the .video-area similar to the local video div for peer videos.
// We also need to append this element to the .video-area div, which is referenced by the
//      this.$remotes variable.
// We will do this in the addRemoteVideo method.
webrtc.on('videoAdded', ($video, peer) => home.addRemoteVideo($video, peer));

webrtc.on('videoRemoved', ($video, peer) => home.removeRemoveVideo(peer));