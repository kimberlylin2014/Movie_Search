export class API {
    static queryManual= {search : "s", id : "i"}
    static API = config.API_KEY;
    static getAPI(query, input, paramObj) {
        let url = API.API + API.queryManual[query] + "=" + input;
        if(query === "id") {
            return url;
        } else {
            // check if api parameter is being passed in
            if(!paramObj) {
                return url;
            } else {
                let param;
                for(let key in paramObj){
                    param = "&" + key + "=" + paramObj[key];
                    url += param;
                }
                return url;
            }
        }       
    }
}


