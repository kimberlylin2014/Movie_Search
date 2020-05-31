import * as UI from "./components/UI.js"
import {Movie} from "./components/movie.js"
import {API} from "./components/api.js"


$(document).ready(function() {
    // Gloal Movie Array for Search Results
    let globalMovieResults = [];
    let dropdownSearchResults = []
    let globalInput = null;
    // ************************** Load Event Listeners ******************************//
    function loadEventListeners() {
        document.querySelector(".search-input").addEventListener("keyup", handleKeyup);
        document.getElementById("search-btn").addEventListener("click", handleSearchClick);
        document.getElementById("search-results").addEventListener("click", handleOverviewClick);
        document.getElementById("modal-close-btn").addEventListener("click", handleModalCloseBtn);
        document.getElementById("select-sort").addEventListener("change", handleSortOption);
        document.querySelector(".pagination").addEventListener("click", handlePageButton);
        document.querySelector(".search-input").addEventListener("click", function(e) {
            document.querySelector(".dropdown-menu").style.display = "none";
        });
        document.getElementById("background-image").addEventListener("click", function(e) {
            document.querySelector(".dropdown-menu").style.display = "none";
        });
    }
    loadEventListeners();
    // ************************** Button Handlers ******************************//
    // KeyUp Handler
    function handleKeyup(e) {
        UI.displayDropDownMenu("none")
        let input = e.target.value;
        if(input.length > 2){
            let url = API.getAPI("search", input)
            UI.displayDropDownMenu("block")
            fetchSearchData(url)
                .then(makeCopyToGlobalDropDownResults)
                .then(UI.displaySearchDropDownResults)
                .catch(handleError)
        } 
    }
    // Search Button Handler with Series Looping
    function handleSearchClick(e) {
        let [input, filter] = UI.beforeFetch(e);
        globalMovieResults = [];
        globalInput = input;
        document.querySelector(".pagination").style.visibility = "hidden"
        let url = API.getAPI("search", input, filter)
        fetchSearchData(url)
            .then(createPageButtons)
            .then(fetchMoviesById)
            .then(createClassObjectsWithGivenArray)
            .then(makeCopyToGlobalArray)
            .then(displayMoviesFromGlobalArray)
            .then(UI.afterFetch)
            .catch(handleError);
    }
    // Overview Button Handler
    function handleOverviewClick(e) {
        let pageNum = UI.checkPageActive();
        if(e.target.classList.contains("overview-btn")) {
            let movieID = e.target.getAttribute("data-id");
            for(let i = 0; i < globalMovieResults.length; i++) {
                if(globalMovieResults[i].page === pageNum) {
                    let selectedMovie = globalMovieResults[i].movieArray.filter((movie) => {
                        return movie.movieID === movieID
                    });
                    UI.displayModalMovie(...selectedMovie);
                }
            }    
        }
    }
    // Modal Close Button Handler
    function handleModalCloseBtn() {
        setTimeout(UI.clearMovieDetails, 200);
    }
    // Sort Select Option Handler 
    function handleSortOption(e) {
        console.log("handle sort options")
        document.getElementById("search-results").textContent = ""
        let pageNum = UI.checkPageActive();
        let movieArray;
        for(let i = 0; i < globalMovieResults.length; i++) {
            if(globalMovieResults[i].page === pageNum) {
                movieArray = [...globalMovieResults[i].movieArray]
            }
        }
        if(e.target.value === "highToLow"){
            sortByRatingHighToLow(movieArray).forEach((movie) => {
                movie.displayUI();
            });
        }else if (e.target.value === "lowToHigh") {
            sortByRatingLowToHigh(movieArray).forEach((movie) => {
                movie.displayUI();
            });
        }else {
            movieArray.forEach((movie) => {
                movie.displayUI();
            });
        }
    }
    // ************************** FUNCTIONS *********************************//

    /**
     * Fetching data when user clicks search
     * @param  {string} url  url from API.getAPI() when Search Button is handled 
     * @return {object}      data response from server
     */ 
    async function fetchSearchData(url) {
        try {
            let resp = await fetch(url);
            let httpResponseResult = await checkHttpResponse(resp);
            let dataResponse = await checkResponseBoolean(httpResponseResult)
            return dataResponse;
        } catch (e) {
            handleError(e);
        }
    }

    function createPageButtons(resp) {
        let page;
        let ul = document.querySelector(".pagination");
        let li = "";
        if(resp.totalResults > 30) {
            page = 3;
        } else if (resp.totalResults < 30) {
            page = 2;
        } else if (resp.totalResults < 20) {
            page = 1;
        }
        for(let i = 1; i < page + 1; i++) {
            li += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
            globalMovieResults.push({page: i, movieArray : null})
        }
        ul.innerHTML = li;
        document.getElementsByTagName("li")[0].classList.add("active")
        return resp;
    }

    /**
     * Fetching detailed data by imdbID
     * @param  {object} resp General response from backend
     * @return {promise}     Resolved promise will return an array of detailed movies
     */ 
    async function fetchMoviesById(resp) {
        let url;
        let detailMoviePromises = await resp.Search.map((movie) => {
            url = API.getAPI("id", movie.imdbID);
            return fetchSearchData(url);
        })
        let allReadyMovies = await Promise.all(detailMoviePromises)
        return allReadyMovies;
    }

    /**
     * Create an array of Movie objects
     * @param  {array} movies Array of detailed movies from backend
     * @return {promise}      Resolved promise will return array of Movie class objects
     */ 
    function  createClassObjectsWithGivenArray(movies) {
       return new Promise(resolve => { 
            let moviesObjects = movies.map((film) => {
                return new Movie(
                    film.imdbID, 
                    film.Title, 
                    film.Year, 
                    film.Director, 
                    film.Plot, 
                    film.Rated,
                    parseInt(film.imdbRating), 
                    film.Poster,
                    film.Actors,
                    film.Awards,
                    film.Genre)
            });
            resolve(moviesObjects)
       });
    } 
    
     /**
     * Make a copy of movie array to globalMovieResults
     * @param  {array} array  Array of objects created from Movie Class
     * @return {promise}      Resolved Promise will return globalMovieResults [array]
     */
    function makeCopyToGlobalArray(array) {
        return new Promise(resolve => {
            let pageNum = UI.checkPageActive()
            for(let i = 0; i < globalMovieResults.length; i++) {
                if(globalMovieResults[i].page === pageNum) {
                    globalMovieResults[i].movieArray = [...array]
                }
            } 
            resolve(globalMovieResults);
        })
    }

     /**
     * Make a copy of movie array to dropDownSearchResults
     * @param  {array} array  Array of objects created from Movie Class
     * @return {promise}      Resolved Promise will return globalMovieResults [array]
     */
    function makeCopyToGlobalDropDownResults(array) {
        return new Promise(resolve => {
            dropdownSearchResults = [...array.Search]
            resolve(dropdownSearchResults);
        })
    }

    /**
     * Display movies on webpage
     * @param  {array} array  Array from globalMovieResults
     * @return {promise}      Resolved promise will return globaleMovieResults [array]
     */
    function displayMoviesFromGlobalArray(globalMovieResults) {
        let pageNum = UI.checkPageActive();
        return new Promise(resolve => {
            for(let i = 0; i < globalMovieResults.length; i ++) {
                if(globalMovieResults[i].page === pageNum) {
                    globalMovieResults[i].movieArray.forEach(film => film.displayUI())
                    resolve("movies all displayed")
                }
            }
        })
    }
    /**
     * Check HTTP Response
     * @param  {object} response  Response from fetch api
     * @return {promise}          Resolved promise will return JSON
     */
    function checkHttpResponse(response) {
        if(response.status === 200 && response.ok) {
            console.log(`response code: ${response.status}`);
            return response.json();
        } else{
            let consoleMessage = `Failed HTTP Response: Status Code ${response.status}`;
            let UImessage = "Network Failure"
            throw {error: new Error(), errtype: "http", consoleMessage: consoleMessage, UImessage: UImessage};
        }
    }
    /**
     * Check if backend sends back an object with property Response 
     * @param  {object} response  Response response.json()
     * @return {promise}          Resolved promise will return data if response === true
     */
    function checkResponseBoolean(response) {
        if(response.Response === "True") {
            return response;
        } else{
            let consoleMessage = `data response: ${response.Response}\ndata error: ${response.Error}`;
            let UImessage = "Invalid Input"
            throw {error: new Error(), type: "data", consoleMessage: consoleMessage, UImessage: UImessage};
        }
    }
    /**
     * Sorts movies from High to Low Ratings
     * @param  {array} array  Array from globalMovieResults
     * @return {array}        Sorted Array
     */
    function sortByRatingHighToLow(array) {
        let sortedArray = [...array];
        sortedArray.sort((obj1, obj2) => {
            return (obj1.movieRatingNum < obj2.movieRatingNum) ? 1: -1
        })
        return sortedArray;
    }

    /**
     * Sorts movies from Low to High Ratings
     * @param  {array} array  Array from globalMovieResults
     * @return {array}        Sorted Array
     */
    function sortByRatingLowToHigh(array) {
        let sortedArray = [...array];
        sortedArray.sort((obj1, obj2) => {
            return (obj1.movieRatingNum > obj2.movieRatingNum) ? 1: -1
        })
        return sortedArray;
    }

    function handleError(e) {
        console.log(e)
        let message;
        if(e.type === "http") {
            console.log(e.consoleMessage);
            window.location.href = "../views/error.html"
        } else if (e.type === "data") {
            console.log(e.consoleMessage)
            message = e.consoleMessage;
        } else {
            message = "Invalid Search"
        }
        UI.removeLoadingButton();
        // UI.displayErrorWarning(message);
    }

    // Bootstrap Pagination New Feature Added
    function handlePageButton(e) {
        document.querySelector(".pagination").style.visibility = "hidden"
        document.getElementById("select-sort").value = "";
        UI.removeActiveButton();
        if(e.target.classList.contains("page-link")){
            console.log("making button active")
            if(e.target.parentElement.classList.contains("page-item")) {
                e.target.parentElement.classList.add("active");
            }
            let loadingImg = `
            <div class="text-center">
                <div class="spinner-border text-secondary mt-5" style="width: 4rem; height: 4rem;" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
            `
            let pageNum = parseInt(e.target.textContent);
            if(checkIfPageAlreadyLoaded(pageNum)){
                document.querySelector(".pagination").style.visibility = "visible"
                searchGlobalArrayBasedOnPageNum(pageNum)
                    .then((foundArray) => {
                        document.getElementById("search-results").textContent = "";
                        foundArray.forEach(film => {
                            film.displayUI();
                        })
                    })
                    .catch(handleError)
            } else {
                document.getElementById("search-results").innerHTML = loadingImg;
                let url = API.getAPI("search", globalInput, {page: pageNum})
                fetchSearchData(url)
                    .then(fetchMoviesById)
                    .then(createClassObjectsWithGivenArray)
                    .then(makeCopyToGlobalArray)
                    .then(removeLoadingImg)
                    .then(displayMoviesFromGlobalArray)
                    .then(UI.afterFetch)
                    .catch(handleError);
            } 
        }
    }

    function searchGlobalArrayBasedOnPageNum(pageNum) {
        return new Promise(resolve => {
            for(let i = 0; i < globalMovieResults.length; i++) {
                if(globalMovieResults[i].page === pageNum ) {
                    resolve(globalMovieResults[i].movieArray)
                }
            }
        });
    }

    function checkIfPageAlreadyLoaded(pageNum) {
        for(let i = 0; i < globalMovieResults.length; i++) {
            if(globalMovieResults[i].page === pageNum) {
                if(globalMovieResults[i].movieArray) {
                    return true;
                }
                return false;
            } 
        }
    }

    function removeLoadingImg(array) {
        return new Promise (resolve => {
            setTimeout(()=> {
                let results = document.getElementById("search-results");
                results.textContent = ""
                resolve(array)
            }, 1000)
        })
    }

});
