import './general';
import apiCall from './services/api/apiCall';
import Chart from 'chart.js';



// added references to all required dom elements in the constructor inside the class
class Status {
    constructor() {
        this.$experienceTab = document.querySelector('#experienceTab');
        this.$professionTab = document.querySelector('#professionTab');
        this.$ageTab = document.querySelector('#ageTab');

        this.$ageCanvas = document.querySelector('#ageChart');
        this.$professionCanvas = document.querySelector('#professionChart');
        this.$experienceCanvas = document.querySelector('#experienceChart');

        this.$loadingIndicator = document.querySelector('#loadingIndicator');
        this.$tabArea = document.querySelector('#tabArea');
        this.$chartArea = document.querySelector('#chartArea');

        this.$errorMessage = document.querySelector('#loadingError');

        this.statisticData; // variable to store data from the server

        this.loadData();
        this.addEventListeners();

    } // end constructor

    // we make a get request via the apiCall with a parameter of statistics
    //  We also add and remove elements depending on success.
    loadData() {
        apiCall('statistics')
            .then(response => {
                this.statisticData = response;

                this.$loadingIndicator.classList.add('hidden');
                this.$tabArea.classList.remove('hidden');
                this.$chartArea.classList.remove('hidden');

                this.loadExperience();
            })
            .catch(() => {
                this.$loadingIndicator.classList.add('hidden');
                this.$errorMessage.classList.remove('hidden');
            });
    }


    //  Only one chart will be visible at a time and the selected tab will
    //      have the active class. 
    //  A simple solution to this problem is hiding all the charts, removing 
    //      .active from all the tab items, and then adding .active only 
    //      to the clicked tab item and displaying the required chart. 
    hideCharts() {
        this.$experienceTab.parentElement.classList.remove('active');
        this.$professionTab.parentElement.classList.remove('active');
        this.$ageTab.parentElement.classList.remove('active');
        this.$ageCanvas.classList.add('hidden');
        this.$professionCanvas.classList.add('hidden');
        this.$experienceCanvas.classList.add('hidden');
    }

    // Whenever we click one of the tab items, it will call the respective load chart function. 
    addEventListeners() {
        this.$experienceTab.addEventListener('click', this.loadExperience.bind(this));
        this.$professionTab.addEventListener('click', this.loadProfession.bind(this));
        this.$ageTab.addEventListener('click', this.loadAge.bind(this));
    }
    // The event parameter is defined with a default value of null. 
    //     If loadExperience() is called with the event parameter (when the user clicks on the tab), 
    //     the if(event) condition will pass and event.preventDefault() will stop the default click action 
    //     of the anchor tag. This will prevent the page from reloading.
    // If this.loadExperience() is called from within the apiCall promise chain, 
    //      it will not have the event parameter and the value of the event defaults to null. 
    //      The if(event) condition will fail (since null is a falsy value) and event.preventDefault() 
    //      won't be executed. This will prevent an exception, since event is not defined in this scenario.
    // After that, this.hideCharts() is called, which will hide all the charts 
    //      and remove .active from all the tabs.
    // The next two lines will remove .hidden from the experience chart's canvas and add the 
    //      .active class to the Experience Tab. add this if statement to the other tabs
    // In the apiCall function's then chain, remove this.loadAge() and this.loadProfession() 
    //      so that only the experience chart will be loaded first (since it is the first tab).
    loadExperience(event = null) {
        if (event) event.preventDefault();
        this.hideCharts();
        this.$experienceCanvas.classList.remove('hidden');
        this.$experienceTab.parentElement.classList.add('active');
        const data = {
            datasets: [{
                data: this.statisticData.experience,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                ]
            }],
            labels: [
                'Beginner',
                'Intermediate',
                'Advanced'
            ]
        };
        new Chart(this.$experienceCanvas, {
            type: 'pie',
            data,
        });
    }

    loadProfession() {
        if (event) event.preventDefault();
        this.hideCharts();
        this.$professionCanvas.classList.remove('hidden');
        this.$professionTab.parentElement.classList.add('active');
        const data = {
            datasets: [{
                data: this.statisticData.profession,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                    'white',
                ]
            }],
            labels: [
                'School Students',
                'College Students',
                'Trainees',
                'Employees'
            ]
        };
        new Chart(this.$professionCanvas, {
            type: 'pie',
            data,
        });
    }

    loadAge() {
        if (event) event.preventDefault();
        this.hideCharts();
        this.$ageCanvas.classList.remove('hidden');
        this.$ageTab.parentElement.classList.add('active');
        const data = {
            datasets: [{
                data: this.statisticData.age,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                ]
            }],
            labels: [
                '10-15 years',
                '15-20 years',
                '20-25 years'
            ]
        };
        new Chart(this.$ageCanvas, {
            type: 'pie',
            data,
        });
    }




} //end class

window.addEventListener("load", () => {
    new Status();
});