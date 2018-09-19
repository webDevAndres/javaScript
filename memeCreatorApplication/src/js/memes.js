import './general';


// document.querySelector() allows us to query the document using, id, class or the elements name.
//      For example <input id="target" class="target-input" type="text"/>
//          document.querySelector('#target');
//          document.querySelector('.target-input');
//          document.querySelector('input#target.target-input');
//      All of these will return the first element matching the query criteria.
//  
// --------------------------------------------------------------------------------------------------------------------

// 2. We need to calculate the device width first.
const deviceWidth = window.innerWidth;

class Memes {
    // 1. Our first step is to create a reference to all the required DOM elements in variables in our class.
    //      We can then use the reference to modify the elements later, from inside the class. Also, whenever
    //      we are creating a reference to DOM elements, it is good to have the variable names start with $.
    //      This way, we can easily know which variables contain values and which ones contain references
    //      to the DOM elements.
    //      document.querySelector() allows us to query the document using, id, class or the elements name.
    constructor() {
        this.$canvas = document.querySelector('#imgCanvas');
        this.$topTextInput = document.querySelector('#topText');
        this.$bottomTextInput = document.querySelector('#bottomText');
        this.$imageInput = document.querySelector('#image');
        this.$downloadButton = document.querySelector('#downloadMeme');

        this.createCanvas();
        this.addEventListeners();
    }
    // 2. We will use JavaScript to create the canvas height and width depending on the screen size. We need to calculate
    //      the device width first. 
    //  This will calculate the device's width and store it in a constant deviceWidth.
    //  This will create a rectanglar canvas with height 480 and width 640 if the device's screen is large enough.
    //      Otherwise, it will create a square canvas with width deviceWidth-30.
    // Math.min(x, y) will return the smallest of two numbers x and y. We reduced the width by 30 because we need to 
    //      have space for the margins. Add this.createCanvas() inside the constructor
    // Height and width are applied only when the page is loaded for the first time; hence, refresh the page when you are checking different devices.
    createCanvas() {
        let canvasHeight = Math.min(480, deviceWidth - 30);
        let canvasWidth = Math.min(640, deviceWidth - 30);
        this.$canvas.height = canvasHeight;
        this.$canvas.width = canvasWidth;
    }

    // 3. Create a function that renders the meme to the canvas.
    //      create a function createMeme() that is going to contain our primary canvas renderer.



    //6. To render something to the canvas is to use the CanvasRenderingContext2D interface to get the 2D rendering context 
    //      for the target <canvas> element.
    //      The context variable will now hold the object of the CanvasRenderingContext2D interface. 
    // To make rendering a little more efficient, we'll add a condition to render only when a user has selected an image. 
    //      We can do this by checking whether the reference to the image input has any files in it. We should start the 
    //      rendering process only when there is a file selected in the input.
    //      To do so, check whether the input element contains any file objects with the if statement
    // 7. To read the selected image, we are going to use FileReader, which allows JavaScript to asynchronously
    //       read the contents of a file (either from a file or raw data). 
    //  FileReader will fire a load event when it's finished reading the file. FileReader also comes with the onload event handler 
    //      to handle the load event.
    //  Inside the if statement, create a new FileReader object and assign it to variable reader using the FileReader() constructor.
    //      We created a new instance of FileReader in the reader variable
    //      We then specified what the reader should do in the onload event handler
    //      Then, we passed the file object of the selected image to the reader object  
    // Once the FileReader has completed reading the file, it will fire the load event, 
    //      which will call the corresponding reader.onload event handler.
    //      reader.result will now contain the image data.
    // 8. We need to create an Image object using the result from FileReader. Create a new instance of the image using
    //       the Image() constructor (we should now write the code inside the reader.onload method)
    // As you can see, dynamically loading an image source is also an asynchronous event and we need to use the 
    //      onload event handler provided by the Image object.
    // 9. Once we have the image loaded, we need to resize the canvas to the image's size.
    //      This will now resize the canvas to the size of the image. Once we have the canvas resized, 
    //      our first step is to erase the canvas. The canvas object has the clearRect() method, which 
    //      can be used to clear a rectangular area in the canvas. In our case, the rectangular area is 
    //      the entire canvas. To clear the entire canvas, we need to use clearRect() with our canvas's 
    //      context object, which is the context variable we created earlier. After that, we need to load 
    //      the image into the canvas. Write the following code inside the image.onload method right after 
    //      assigning the canvas dimensions:
    // context.clearRect(0, 0, this.$canvas.height, this.$canvas.width); and context.drawImage(image,0,0);
    //      Clear a rectangular area in the canvas starting from the top-left coordinates (0,0), that is, 
    //      the first two parameters of the clearRect() method and then create a rectangle with its height and width equal 
    //      to that of the canvas, that is, the last two parameters of the clearRect() method. This effectively clears the 
    //      entire canvas.
    //      Draw an image onto the canvas using the image stored in the image object starting from the coordinates (0,0). 
    //      Since the canvas has the same dimensions as the image, the image will cover the entire canvas.
    // 10. For our first step, we need the font size to be responsive. Since we have the canvas height and width, 
    //      we can use that to get a font size that is 4% of the average of the image height and width. We can center
    //      align the text using the textAlign property
    //      Also, we need to specify a baseline using the textBaseline property. It is used to position the text at 
    //      the specified location. First, the canvas creates a baseline at the location we specify for the text. 
    //      Then, it will write the text above, below, or over the baseline based on the value supplied to textBaseline.
    //      We have specified the font to be 4% of the average of the canvas height and width and set the font style to sans-serif. 
    //      Also, by setting textBaseline to top, the baseline will be on top of the text, that is, the text will be rendered 
    //      below the baseline.
    //  Canvas does not have an option to apply stroke to the text. Hence, to create a white text with black stroke, 
    //      we need to create two different texts, a black stroke text and a white fill text,with the line width of 
    //      the stroke text being slightly bigger than the fill text, and place them one over another.
    //      Create styles for the stroke text and fill text. This will get the value from the input fields and automatically convert
    //       the text to uppercase letters.
    // Consider context.strokeText(). This is how the text gets rendered:
    //      The first parameter of the strokeText method, topText contains the text to be rendered.
    //      The second and third parameters contain the location where the text should start rendering. Along the x axis, 
    //      the text should start rendering from the middle of the canvas (this.$canvas.width/2). The text will be center aligned 
    //      and along the y axis from a height that is 5% from the top of the canvas (this.$canvas.height*(5/100)). 
    //      The text will be rendered.



    createMeme() {
        let context = this.$canvas.getContext('2d');

        if (this.$imageInput.files && this.$imageInput.files[0]) {
            let reader = new FileReader();

            reader.onload = () => {
                let image = new Image();

                image.onload = () => {
                    this.$canvas.height = image.height;
                    this.$canvas.width = image.width;

                    context.clearRect(0, 0, this.$canvas.height, this.$canvas.width);
                    context.drawImage(image, 0, 0);

                    let fontSize = ((this.$canvas.width + this.$canvas.height) / 2) * 4 / 100;
                    context.font = `${fontSize}pt sans-serif`;
                    context.textAlign = `center`;
                    context.textBaseline = `top`;

                    context.lineJoin = 'round';

                    // for stroke text
                    context.lineWidth = fontSize / 5;
                    context.strokeStyle = 'black';

                    // for fill text
                    context.fillStyle = 'white';


                    const topText = this.$topTextInput.value.toUpperCase();
                    const bottomText = this.$bottomTextInput.value.toUpperCase();

                    // Top Text
                    context.strokeText(topText, this.$canvas.width / 2, this.$canvas.height * (5 / 100));
                    context.fillText(topText, this.$canvas.width / 2, this.$canvas.height * (5 / 100));

                    // Bottom Text
                    context.strokeText(bottomText, this.$canvas.width / 2, this.$canvas.height * (90 / 100));
                    context.fillText(bottomText, this.$canvas.width / 2, this.$canvas.height * (90 / 100));

                    this.resizeCanvas(this.$canvas.height, this.$canvas.width);


                };
                image.src = reader.result;

            };

            reader.readAsDataURL(this.$imageInput.files[0]);
            console.log('this will get printed first!');
        }
    }

    // 11. This is how resizeCanvas() works:
    //      This function will initially apply the height and width of the canvas in CSS to its actual height and width 
    //      (so that the zoom level of the previous image is not remembered).
    //      Then, it will check whether the height and width are either greater than the minimum of 1000px or deviceWidth-30 
    //      (we already defined the deviceWidth constant).
    //      If the canvas size is greater than the given condition, we reduce the height and width by half and then assign the new 
    //      values to the canvas's CSS 
    //      (this will zoom out the canvas).
    //      Since it is a while loop, the operation is repeated until the canvas size goes below the condition, thus, effectively 
    //      zooming out the canvas 
    //      and preserving the page layout.
    //      Simply call this.resizeCanvas(this.$canvas.height, this.$canvas.width) inside the image.onload method after the code 
    //      to render text in the canvas.
    resizeCanvas(canvasHeight, canvasWidth) {
        let height = canvasHeight;
        let width = canvasWidth;
        this.$canvas.style.height = `${height}px`;
        this.$canvas.style.width = `${width}`;
        while (height > Math.min(1000, deviceWidth - 30) && width > Math.min(1000, deviceWidth - 30)) {
            height /= 2;
            width /= 2;
            this.$canvas.style.height = `${height}px`;
            this.$canvas.style.width = `${width}px`;
        }
    }

    // 12. Now, to download the meme, we need to convert the canvas into an image and attach the image as the attribute to
    //      the download button. Create a new function downloadMeme() inside the Memes class. In the addEventListeners() function, 
    //      add the following line: this.$downloadButton.addEventListener('click', this.downloadMeme.bind(this));
    // Now, clicking the download button will convert the canvas into an image and let the browser download it
    //      First, the canvas is converted into a 64-bit encoded png URL using the toDataURL('image/png') method and is stored in
    //      the imageSource constant.
    //      Create another constant att that contains an HTML 'href' attribute object.
    // Now, change the value of the att object to the image URL stored in imageSource while changing the mime type from 
    //      data:image to data:application/octet-stream.
    //  This step is necessary because most browsers display images directly instead of downloading them. By changing the mime type 
    //      to octet-stream (used for binary files), we can trick the browser into thinking the file is not an image and, hence, 
    //      download the file instead of viewing it.
    //Finally, assign the att object as an attribute of $downloadButton, which is an anchor tag with the download attribute. 
    //      The value of the download attribute will be the default name of the downloaded image.
    // In the imageSource.replace() method, a regular expression is used for changing the mime type of the image.
    // Before downloading the meme from the Meme Creator, we need to validate the form so that there must be an image selected and, 
    //      at least, the bottom text box is filled in order to download the meme. We need to add the form validation code in 
    //      the downloadMeme() function above the code to download the file
    // The previous code will check for an image and text in the bottom text input box and stop downloadMeme() from continuing 
    //      execution using the return keyword. Once an empty field has been found, it will add the .has-error class to the input's parent 
    //      div, which, according to Bootstrap, highlights the input in a red border

    downloadMeme() {
        if(!this.$imageInput.files[0]) {
            this.$imageInput.parentElement.classList.add('has-error');
            return;
        }
        if(this.$bottomTextInput.value === '') {
            this.$imageInput.parentElement.classList.remove('has-error');
            this.$bottomTextInput.parentElement.classList.add('has-error');
            return;
        }
        this.$imageInput.parentElement.classList.remove('has-error');
        this.$bottomTextInput.parentElement.classList.remove('has-error');

        const imageSource = this.$canvas.toDataURL('image/png');
        let attr = document.createAttribute('href');
        attr.value = imageSource.replace(/^data:image\/[^']/, 'data:appplication/octet-stream');
        this.$downloadButton.setAttributeNode(attr);
    }

    // 4. Create an event listener function.
    //      we need to render the entire canvas every time a change happens. So, we need to attach event listeners to all
    //      the input elements. Event listeners let us handle more than one event for an element. Hence, they are widely
    //      preferred.
    //      we need to call createMeme whenever a text is entered into the TopTextInput and BottomTextInput areas.
    //      Add this.addEventListeners() inside the constructor 
    //      So, we need to attach an event listener that listens to the keyup event on these input boxes.
    // let inputNodes creates an array of reference objects to all the target input elements.
    // Then, we use the forEach() method to loop through each element inthe array and attach an event listener to it

    // 5. We have also added $imageInput in inputNodes. This element is not going to be affected much with the keyup event,
    //      but we need this to be monitored when a user uploads a new image. Also, if the user copies and pastes text into the 
    //      text inputs without pressing any keyboard buttons, we need to handle the change. Both of these scenarios can be handled 
    //      using the change event.
    // Whenever the user types in some text or uploads a new image, the this.createMeme() method will be automatically called.
    //      Since we are using ES6 arrow functions here, you might be wondering why this didn't automatically inherit its value from the parent. 
    //      It's because, this time, we are sending this.createMeme as a parameter to the addEventListener() method of the target element. 
    //      Hence, that input element becomes the new parent for inheriting the this object. To overcome this problem, change this.createMeme
    //      to this.createMeme.bind(this)


    addEventListeners() {
        this.createMeme = this.createMeme.bind(this);
        this.$downloadButton.addEventListener('click', this.downloadMeme.bind(this));
        let inputNodes = [this.$topTextInput, this.$bottomTextInput, this.$imageInput];

        inputNodes.forEach(element => element.addEventListener('keyup', this.createMeme));
        inputNodes.forEach(element => element.addEventListener('change', this.createMeme));
    }


} //end memes class

new Memes();