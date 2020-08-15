export function getUser(token){
    const init = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + token}
    }

    return fetch('http://localhost:8000/user/', init);
}

export function authenticateUser(){
    return new Promise((resolve)=>{
        setTimeout(() => {
            let token = localStorage.getItem("token");
            if(token === null){
                resolve({authenticated: false, user: null});
                return;
            }
            getUser(token)
            .then(
                async (response) => {
                    if(response.ok === false){
                        resolve({authenticated: false, user: null});
                    }
                    else{
                        let json = await response.json()
                        resolve({authenticated: true, user: json.data});
                    }
                }
            )
        }, 500);
    })
}