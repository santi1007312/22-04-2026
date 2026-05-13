export const post = (url, body) =>{
    fetch(`http://localhost:3000/${url}`,{
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
    })
    .then(response => response.json())
    .then(json => console.log(json));
}