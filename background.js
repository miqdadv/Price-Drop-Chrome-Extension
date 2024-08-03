// const { token } = require("morgan");

console.log("Background.js Line 1 is running !");
const url = "http://localhost:8000/";

function getRequest(reqData, api){
    $.ajax({    
        type: "GET",
        url: url + api,
        data : reqData,
        success: (data,status)=> {
            console.log("success ajax get from bg.js");
            console.log(data);
            console.log(status);
            return Data;
        },
        error:()=>{
            console.log("error ajax post");
        }
    });
}

async function postRequest(reqData, api){
    $.ajax({    
        type: "POST",
        url: url + api,
        data: reqData,
        success: (data,status)=> {
            console.log("success ajax post from bg.js");
            console.log(status);
            if(status == "success"){
                if(data.token != undefined){
                    chrome.storage.sync.set({token: data.token}, function() {
                        console.log('Token Value is set to ' + data.token);
                    });
                    chrome.storage.sync.get(['token'], function(result) {
                        console.log('Token value currently is ' , result.token);
                    });
                }
                console.log(data);
                return data;
            }
        },
        error:()=>{
            console.log("error ajax post");
        }
    });
}
async function verifyUser(reqData , api){
    console.log("the token i am sending is" , reqData.token);
    return new Promise((resolve, reject) => {
        $.ajax({    
            type: "GET",
            url: url + api,
            headers:{
                token: reqData.token
            },
            success: (data,status)=> {
                console.log('in the "success" of ajax ')
                if (Object.values(data)[0] != undefined) {
                    console.log("completed ajax request");
                    console.log(Object.values(data)[0]);
                    resolve(data);
                } else {
                    reject();
                }
            },
            error:(err)=>{
                console.log("error ajax post");
                return err;
            }
        });
    });
}
async function verifyLogin(reqData , api){
    console.log("the login details i am sending is " , reqData.email);
    return new Promise((resolve, reject) => {
        $.ajax({    
            type: "POST",
            url: url + api,
            data : reqData,
            success: (data,status)=> {
                console.log('in the "success" of ajax ')
                if (Object.values(data)[0] != undefined) {
                    console.log("completed ajax request");
                    console.log(Object.values(data)[0]);
                    console.log(data);
                    resolve(data);
                } else {
                    reject(err);
                }
            },
            error:(err)=>{
                console.log("error ajax get");
                console.log(err);
                reject (err);
            }
        });
    });
}
function readLocalStorage(key) {
    console.log(3);
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([key], function(items) {
            if (Object.values(items)[0] != undefined) {
                console.log("completed readLocalStorage");
                console.log(items);
                console.log(Object.values(items)[0]);
                resolve(Object.values(items)[0]);
            } else {
                console.log("promise rejected");
                reject();
            }
        });
    });
};
async function getData (key, request){
    console.log(2);
    try{
        request.email = await readLocalStorage('email');
        let res = await postRequest(request, 'user/insert');
        console.log("back ground.js sent post Req ", res);
        return res;
    }catch(err){
        console.log("this is the error " , err);
        return "Error"
    }
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message == "Sign Up Complete"){
            sendResponse({message: "Credentials recieved at background.js"});
            console.log(request);
            request.products = [{
                name : "sample product",
                price : 0,
                item_n : 000000
            }];
            postRequest(request, 'user/signup');
        }
        if (request.message == "Verify user through token"){
            console.log(request);
            let userData = verifyUser(request, 'user/me');
            console.log("Verification Result : ")
            console.log(userData);
            userData.then(function(result) {
                // here you can use the result of 
                console.log("this is result");
                console.log(result);
                sendResponse(result);
            });
        }
        if (request.message == "Verify user through Login Credentials"){
            console.log(request);
            let userData = verifyLogin(request, 'user/login');
            console.log("Verification Result : ")
            console.log(userData);
            userData.then(function(result) {
                // here you can use the result of 
                console.log("this is result");
                console.log(result);
                sendResponse(result);
            });
        }
        if (request.message == "Add this to products"){
            console.log(request);
            let res = getData('email', request);
            return res;
        }
        return true;
    }
)