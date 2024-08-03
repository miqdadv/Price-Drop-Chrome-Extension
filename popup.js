// the array contains the dependencies : in this case 'ui.router'
const url = "http://localhost:8000/post";
let amazonextension = 
    angular
        .module("amazonextension", [
            'ui.router'
        ])
        .config(['$urlRouterProvider' , '$stateProvider' , function($urlRouterProvider, $stateProvider){
            $urlRouterProvider.otherwise('/welcome');
            
            $stateProvider
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'templates/welcome.html',
                controller:function($scope){
                    $scope.title = "Welcome";
                    $scope.verifyUser = function(){
                        console.log("Verify User Called")
                        let data = {};
                        let res;
                        function readLocalStorage(key) {
                            return new Promise((resolve, reject) => {
                                chrome.storage.sync.get([key], function(items) {
                                    if (Object.values(items)[0] != undefined) {
                                        console.log("completed readLocalStorage");
                                        resolve(Object.values(items)[0]);
                                    } else {
                                        reject();
                                    }
                                });
                            });
                        };
                        function sendMessage() {
                            return new Promise((resolve, reject) => {
                                chrome.runtime.sendMessage(data, function(response) {
                                    if (response != undefined) {
                                        console.log("completed sending message");
                                        console.log(Object.values(response)[0]);
                                        resolve(response);
                                    } else {
                                        console.log("rejected");
                                        reject();
                                    }
                                });
                            });
                        };
                        async function getData(){
                            try{
                                data['token'] = await readLocalStorage('token');
                                data.message = "Verify user through token";
                                console.log("inside welcome ctrl");
                                console.log(JSON.stringify(data));

                                res = await sendMessage(data);
                                console.log("THIS IS RES : ")
                                console.log(res);

                                for(key in res){
                                    chrome.storage.sync.set({key: res.key}, function() {
                                        console.log( key + ' is set to ' + res.key);
                                    });
                                }
                                chrome.storage.sync.set({lastCheck : new Date});
                            }catch(err){
                                console.log(err);
                            }
                        };
                        getData();
                    };
                }
            })
            .state('home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller:function($scope){
                    $scope.title = "Home";
                    $scope.email = getData('email');
                    function readLocalStorage(key) {
                        console.log(3);
                        return new Promise((resolve, reject) => {
                            chrome.storage.sync.get([key], function(items) {
                                if (Object.values(items)[0] != undefined) {
                                    console.log("completed readLocalStorage");
                                    resolve(Object.values(items)[0]);
                                } else {
                                    console.log("promise rejected");
                                    reject();
                                }
                            });
                        });
                    };
                    async function getData (key){
                        console.log(2);
                        try{
                            let value = await readLocalStorage(key);
                            console.log("email is ", value);
                            // alert(value);
                            $scope.email = value;
                            return value;
                        }catch(err){
                            console.log("this is the error " , err);
                            return "Error"
                        }
                    }
                    console.log(1);
                    console.log($scope.email);
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: function($scope){
                    let data = {};
                    $scope.title = "Login";
                    $scope.password;
                    $scope.email;
                    $scope.submitted= function(){
                        // verify login data chrome send msg
                        // change chrome.storage data acc to curr user
                        console.log("login submitted called");
                        function sendMessage(reqData) {
                            console.log("inside sendMessage");
                            return new Promise((resolve, reject) => {
                                chrome.runtime.sendMessage(reqData, function(response) {
                                    if (response != undefined) {
                                        console.log("completed sending message");
                                        console.log(Object.values(response)[0]);
                                        resolve(response);
                                    } else {
                                        console.log("rejected");
                                        reject();
                                    }
                                });
                            });
                        };
                        async function getData(){
                            try{
                                data.message = "Verify user through Login Credentials";
                                data.email = $scope.email;
                                data.password = $scope.password;
                                console.log("inside login ctrl");
                                console.log(JSON.stringify(data));

                                res = await sendMessage(data);
                                console.log("THIS IS RES : ")
                                console.log(res);
                                if(res.token != undefined){
                                    chrome.storage.sync.set({lastCheck : new Date});
                                    chrome.storage.sync.set({email : $scope.email});
                                    chrome.storage.sync.set({token : res.token});
                                }
                            }catch(err){
                                console.log(err);
                            }
                        };
                        getData();

                    }
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'templates/signup.html',
                controller:  function($scope){
                    $scope.title = "Sign Up";
                    $scope.Name;
                    $scope.email;
                    $scope.password;
                    $scope.username;
                    $scope.submitted= function(){
                        // if($scope.email.)
                        $scope.data = {
                            message : "Sign Up Complete",
                            name : $scope.Name,
                            username : $scope.username,
                            email: $scope.email ,
                            password : $scope.password
                        };
                        console.log($scope.data);
                        chrome.runtime.sendMessage($scope.data, function(response) {
                            console.log(response.message);
                        });
                    };
                }
            })
        }])
