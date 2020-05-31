import{setAttributes} from "../utility/helper.js";
import {setObjectProperties} from "../utility/helper.js"

export let getInput = function(querySelector) {
    let input = document.querySelector(querySelector).value;
    return input
}
export let clearInput = function(querySelector) {
    document.querySelector(querySelector).value = "";
    document.getElementById("year-radio").checked = false;
    document.getElementById("year-input").value = ""
}
export function clearMovieDetails() {
    document.getElementById("modal-img").removeAttribute("src");
    for(let i = 0; i < document.querySelectorAll(".movie-title").length; i++){
        document.querySelectorAll(".movie-title")[i].textContent = "";
    }
}
export function displayModalMovie(movie) {
    console.log(movie)
    document.getElementById("modal-img").setAttribute("src", movie.moviePoster);
    document.getElementById("modal-title").innerHTML = `${movie.movieTitle}`;
    document.getElementById("movie-actors").innerHTML = `Actors: <br> ${movie.movieActors}`;
    document.getElementById("rated").innerHTML = `Rated: <br> ${movie.movieRated}`;
    document.getElementById("awards").innerHTML = `Award: <br> ${movie.movieAwards}`;
    document.getElementById("genre").innerHTML = `Genre: <br> ${movie.movieGenre}`;
}
export function displayErrorWarning(message) {
    let displayErrorSection = document.getElementById("response-error");
    displayErrorSection.textContent = message;
    displayErrorSection.style.visibility = "visible";
    setTimeout(function() {
        displayErrorSection.style.visibility = "hidden";
    }, 3000);
}
// DisplayLoadingImage
export function displayLoadingButton() {
    document.getElementById("search-btn").disabled = true;
    document.getElementById("search-btn-text").style.display = "none"
    document.querySelector(".loading-spinner").style.display = "block"
}
export function removeLoadingButton() {
    document.getElementById("search-btn").disabled = false;
    document.getElementById("search-btn-text").style.display = "block"
    document.querySelector(".loading-spinner").style.display = "none"
}
 // remove old search results and assign new array to GlobalMovieResults
export function removeSearchResults() {
    document.getElementById("search-content").style.visibility = "hidden";
    document.getElementById("search-results").textContent = "";
    document.getElementById("result-text").textContent = ""
}
export function displayResultsHeader(input) {   
    document.getElementById("search-content").style.visibility = "visible";
    document.getElementById("result-text").appendChild(document.createTextNode(input))    
}
// search drop down UI
export function displaySearchDropDownResults(ownResults)  {
    let top3image = document.querySelectorAll(".top3-img");
    let top3title = document.querySelectorAll(".top3-title");
    let top3year = document.querySelectorAll(".top3-year");
    top3image.forEach((img) => {
        img.removeAttribute("src");
    });
    top3title.forEach((title) => {
        title.textContent = ""
    });
    top3year.forEach((year) => {
        year.textContent = ""
    });
    let movieLength = ownResults.length > 0 && ownResults.length < 4 ? ownResults.length: 3;
    for(let i = 0; i < movieLength; i++) {
        top3title[i].textContent = ownResults[i].Title.slice(0, 25) + "..";
        top3year[i].textContent = `(${ownResults[i].Year})`;
        if(ownResults[i].Poster === "N/A") {
            ownResults[i].Poster = "https://image.flaticon.com/icons/svg/1179/1179069.svg"
        }
        top3image[i].setAttribute("src", ownResults[i].Poster)
    }       
}

export function displayDropDownMenu (displayFunction) {
    let menu = document.querySelector(".dropdown-menu");
    menu.style.display = displayFunction;
}
// Check if Search Filter is Applied [refactored]
function checkIfFilterChecked() {
    let radioYearButton = document.getElementById("year-radio");
    let radioYearInput =  document.getElementById("year-input");
    if(radioYearButton.checked && radioYearInput.value) {
        let filterObject = {};
        setObjectProperties(filterObject, {"y" : radioYearInput.value});
        return filterObject;
    } else { 
        return null;
    }
}
// UI BEFORE AND AFTER FETCH
    // UI -- UI after Fetch is done [refactored]
    export function afterFetch() {
    
        // firstPageActiveByDefault()
        document.querySelector(".pagination").style.visibility = "visible"
        displayResultsHeader(getInput("input[type='search']"));
        clearInput("input[type='search']");
        removeLoadingButton();
        if(getInput("input[type='search']") === "") {
            document.querySelector(".dropdown-menu").style.display = "none"
        }
    }
    // UI -- UI before Fetch [refactored]
    export function beforeFetch(e) {
        e.preventDefault();
        displayLoadingButton();
        removeSearchResults();
        let input = getInput("input[type='search']");
        let filter = checkIfFilterChecked();
        return [input, filter];
    }

    export function removeActiveButton() {
        let pageItems = document.getElementsByTagName("li");
        for(let i = 0; i < pageItems.length; i++) {
            if(pageItems[i].classList.contains("active")){
                pageItems[i].classList.remove("active")
            }
        }
    }

    export function checkPageActive() {
        let pageItems = document.getElementsByTagName("li");
        for(let i = 0; i < pageItems.length; i++) {
            if(pageItems[i].classList.contains("active")){
                return parseInt(pageItems[i].firstChild.textContent);
            } 
        }
    }