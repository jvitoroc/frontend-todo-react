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
                resolve(false);
                return;
            }
            getUser(token)
            .then(
                async response => {
                    if(response.ok === false){
                        resolve(false);
                    }
                    else{
                        resolve(true);
                    }
                }
            )
        }, 2000);
    })
}