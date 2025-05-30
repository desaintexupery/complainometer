

var current = 0;
const min = 0;
const max = 100;

//This function is taken from: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability
//This is used to check if localStorage is available
function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

//This function should be called each time you update the progress so the display updates as well
function updateProgress()
{
	document.querySelector(".progress-text").innerText = `you have complained ${current} out of ${max} too many times.`; //this sets the text including the variable values
	document.querySelector(".progress-bar").style.width = Math.round((current / max) * 100) + "%"; //this sets the length of the progress-bar to a percentage
	document.querySelector(".progress-percentage").innerText = "$5,00"; //this displays the progress as a percentage
}

//this function is called each time the increase button is clicked
function onButtonIncreaseClicked(e)
{
	e.preventDefault(); //prevent the button from doing anything else

	//make sure the current value never goes above the max value
	if (current < max)
		current++;

	//this will set the value in the localStorage as long as it is available and accessible
	if (storageAvailable('localStorage'))
	{
		localStorage.setItem("progress", current); //our "key" is set to contain the value of current
	}

	updateProgress(); //call to update the display
}

//identical to the increase button, only decreases
function onButtonDecreaseClicked(e)
{
	e.preventDefault();

	//prevent us from going below the minimum value
	if (current > min)
		current--;

	if (storageAvailable('localStorage'))
	{
		localStorage.setItem("progress", current);
	}

	updateProgress(); //always call to update the display
}

//this function is to register the button click event handlers. This makes clicking the buttons work. You should only call this once per page load.
function registerHandlers()
{
	document.querySelector("#btnIncrease").addEventListener("click", onButtonIncreaseClicked);
	document.querySelector("#btnDecrease").addEventListener("click", onButtonDecreaseClicked);
}

//this function is to unregister the button click event handlers. This prevents the buttons from working. Just incase.
function unregisterHandlers()
{
	document.querySelector("#btnIncrease").removeEventListener("click", onButtonIncreaseClicked);
	document.querySelector("#btnDecrease").removeEventListener("click", onButtonDecreaseClicked);
}

//This is our setup function. You should call this once per page load.
function setup()
{
	//check if localstorage is available and if there's a valid number in it
	if (storageAvailable('localStorage') && localStorage.getItem("progress") != null && !isNaN(localStorage.getItem("progress")))
	{
		current = parseInt(localStorage.getItem("progress")); //load our stored value

		if (current > max) //make sure the stored value is not above our max value
			current = max;
		else if (current < min) //make sure the stored value is not below our min value
			current = min;
	}

	registerHandlers(); //make clicking buttons work
	updateProgress(); //update the display
}

setup(); //our call to setup everything, should be called once per page load.