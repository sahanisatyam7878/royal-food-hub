
function checkLogin(){
 let user = localStorage.getItem("loggedIn");
 if(!user){
   location.href="login.html";
 }
}
function logout(){
 localStorage.removeItem("loggedIn");
 location.href="login.html";
}
