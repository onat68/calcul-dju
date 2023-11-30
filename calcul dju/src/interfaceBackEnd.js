class Requests {
    
    getCities() {
        return fetch("/api/postal/68230", {
            method: "GET"
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch((error) => console.log(error))
    }
}