export class Movie {
    static ratingImagesOptions =  {
        zeroToFive : "../../images/1533919.svg",
        fiveToEight: "../../images/1533913.svg",
        nineAndAbove: "../../images/616656.png"
    }
    constructor(id, title, year, director, plot, rated, ratingNum, poster, actors, awards, genre){
        this.movieID = id;
        this.movieTitle = title;
        this.movieYear = year;
        this.movieDirector = director;
        this.moviePlot = plot;
        this.movieRated = rated;
        this.movieRatingNum = ratingNum
        this.moviePoster = poster;
        this.movieRatingImage = this.displayRatingImage();
        this.movieActors = actors
        this.movieAwards = awards,
        this.movieGenre = genre
    }
    displayRatingImage() {
        if(this.movieRatingNum >= 0 && this.movieRatingNum <=5){
            return Movie.ratingImagesOptions["zeroToFive"];
        } else if (this.movieRatingNum > 5 && this.movieRatingNum < 8) {
            return Movie.ratingImagesOptions["fiveToEight"];
        } else if (this.movieRatingNum >= 8 && this.movieRatingNum <= 10) {
            return Movie.ratingImagesOptions["nineAndAbove"];
        } else {
            return "../../images/2919643.svg"
        }
    }
    displayRatingNum(rating) {
        if(isNaN(rating)){
            return "Not Rated"
        } else {
            return `${rating}/10`;
        }
    }
    displayMoviePoster() {
        if(this.moviePoster === "N/A") {
            return "../../images/1179069.svg"
        }else {
            return this.moviePoster
        }
    }
    displayUI() {
        let resultSection = document.getElementById("search-results");
        let content = ` 
        <div class="row d-flex align-items-center" id="row-section">
            <div class="col-4">
              <div class="row">
                <div class="col-sm-12 col-md-6 d-flex align-items-center justify-content-center mobile-view">
                    <img src="${this.movieRatingImage}" alt="rating-img" width="30px;">
                    <p class="movie-score">${this.displayRatingNum(this.movieRatingNum)}</p>
                </div>
                <div class="col-sm-12 col-md-6 d-flex align-items-center justify-content-center" >
                  <img src="${this.displayMoviePoster()}" alt="poster-img" width="100px" style="margin-right: 5px;">
                </div>      
              </div>
            </div>
            <div class="col-8 d-flex flex-column align-items-left justify-content-center">
              <h5 class="movie-subtitle">${this.movieTitle} (<span>${this.movieYear}</span>)</h5>
              <p class="movie-subtitle">Director: <span class="subtitle-content">${this.movieDirector}</span></p>
              <p class="movie-subtitle">Plot: <span class="subtitle-content">${this.moviePlot}</span></p>
              <button class="btn btn-dark btn-sm overview-btn" data-target="#myModal" data-toggle="modal" data-id="${this.movieID}" style="width: 15%">More</button>
            </div> 
         </div>
         <hr>
        `
        resultSection.innerHTML += content;
    }
}

