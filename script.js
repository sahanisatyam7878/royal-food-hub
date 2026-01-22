
// ===== CLEAN STABLE CART SYSTEM (AUTO CALCULATE ENABLED) =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount(){
  const el = document.getElementById("cartCount");
  if(!el) return;
  let count = cart.reduce((s,i)=> s + i.qty, 0);
  el.innerText = count;
}

function calculateTotal(){
  let total = 0;
  cart.forEach(i => total += i.price * i.qty);
  const t = document.getElementById("totalAmount");
  if(t) t.innerText = total;
  const live = document.getElementById("liveTotal");
  if(live) live.innerText = total;
  return total;
}

function addToCart(name, price){
  let item = cart.find(i => i.name === name);
  if(item){
    item.qty++;
  } else {
    cart.push({name:name, price:price, qty:1});
  }
  saveCart();
  updateCartCount();
  calculateTotal();
  alert(name + " added to cart");
}

function renderDashboard(){
  const body = document.getElementById("billBody");
  if(!body) return;
  body.innerHTML = "";

  cart.forEach((i,idx)=>{
    let amt = i.price * i.qty;
    body.innerHTML += `
      <tr>
        <td>${i.name}</td>
        <td>Full</td>
        <td>
          <button onclick="decQty(${idx})">-</button>
          ${i.qty}
          <button onclick="incQty(${idx})">+</button>
        </td>
        <td>₹${i.price}</td>
        <td>₹${amt}</td>
        <td><button onclick="removeItem(${idx})">Remove</button></td>
      </tr>`;
  });

  calculateTotal();
}

function incQty(index){
  cart[index].qty++;
  saveCart();
  renderDashboard();
  updateCartCount();
}

function decQty(index){
  if(cart[index].qty > 1){
    cart[index].qty--;
    saveCart();
    renderDashboard();
    updateCartCount();
  }
}

function removeItem(index){
  cart.splice(index,1);
  saveCart();
  renderDashboard();
  updateCartCount();
}

function clearCart(){
  if(!confirm("Are you sure you want to clear the cart?")) return;

  cart = [];
  localStorage.removeItem("cart");
  renderDashboard();
  updateCartCount();
  calculateTotal();
  alert("Cart cleared successfully");
}

function saveOrder(){
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let total = calculateTotal();
  orders.push({
    date: new Date().toLocaleString(),
    items: cart,
    total: total
  });
  localStorage.setItem("orders", JSON.stringify(orders));
  alert("Order saved successfully");
}

window.onload = function(){
  updateCartCount();
  renderDashboard();
  calculateTotal();
};

// ===== LIVE TOTAL FIXED =====
function updateLiveTotal() {
  let total = 0;
  cart.forEach(i => total += i.price * i.qty);
  const el = document.getElementById('liveTotal');
  if (el) el.textContent = total;
}

// ===== DAILY SALES =====
function saveOrderToDailySales(totalAmount) {
    const today = new Date().toISOString().split('T')[0];
    let sales = JSON.parse(localStorage.getItem("dailySales") || "{}");

    if (!sales[today]) sales[today] = 0;
    sales[today] += Number(totalAmount);

    localStorage.setItem("dailySales", JSON.stringify(sales));
}

function showDailySales() {
    const today = new Date().toISOString().split('T')[0];
    let sales = JSON.parse(localStorage.getItem("dailySales") || "{}");
    let amount = sales[today] || 0;

    alert("Today's Total Sales: ₹" + amount);
}

// ===== QR PAYMENT =====
function showQRIfOnline() {
    const modes = document.getElementsByName("paymode");
    let selected = "Cash";
    for (let m of modes) {
        if (m.checked) selected = m.value;
    }

    const qrBox = document.getElementById("qrBox");
    if (qrBox) {
        qrBox.style.display = (selected === "Online") ? "block" : "none";
    }
}

// ===== FINAL PAYMENT FIX =====
function processPayment() {
    const modes = document.getElementsByName("paymode");
    let selected = "Cash";
    for (let m of modes) {
        if (m.checked) selected = m.value;
    }

    let total = 0;
    const span = document.getElementById("totalAmount");
    if (span) {
        total = Number(span.textContent.trim());
    }

    const status = "Paid";

    localStorage.setItem("lastPaymentMode", selected);
    localStorage.setItem("lastPaymentStatus", status);
    localStorage.setItem("lastPaymentAmount", total);

    alert(
        "Payment Successful!\n" +
        "Mode: " + selected + "\n" +
        "Status: " + status + "\n" +
        "Amount: ₹" + total
    );

    if (typeof saveOrderToDailySales === "function") {
        saveOrderToDailySales(total);
    }
}
