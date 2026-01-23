
function openLogin(){ window.location.href = "login.html"; }
function openRegister(){ window.location.href = "register.html"; }
function goBack(){ history.back(); }

function filterType(type){
  const items = document.querySelectorAll(".menu-item");
  items.forEach(i=>{
    if(type==="all") i.style.display="block";
    else if(i.classList.contains(type)) i.style.display="block";
    else i.style.display="none";
  });
}

function monthly(){
  alert("Monthly report feature coming soon");
}

function del(i){
  alert("Delete feature coming soon");
}


function exportExcel(){
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let csv = "Date,Total\n";
  orders.forEach(o=>{
    csv += `"${o.date}",${o.total}\n`;
  });
  let blob = new Blob([csv], {type: "text/csv"});
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "orders.csv";
  a.click();
}
