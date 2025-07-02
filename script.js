document.addEventListener('DOMContentLoaded', () => {
  const goodsContainer = document.getElementById("goodsContainer");
  const goods = JSON.parse(localStorage.getItem("goods")) || [];

  goods.forEach((good, index) => {
    const div = document.createElement("div");
    div.className = "good-item";
    div.innerHTML = `
      <img src="${good.image}" alt="${good.name}" class="good-img" onclick="openModal(${index})">
      <h3>${good.name}</h3>
      <p><strong>Available:</strong> ${good.qty}</p>
      <p>${good.desc}</p>
    `;
    goodsContainer.appendChild(div);
  });

  window.openModal = function(index) {
    const good = goods[index];
    document.getElementById("modalItemName").textContent = `Order: ${good.name}`;
    document.getElementById("modalOrderForm").dataset.index = index;
    document.getElementById("orderQty").value = 1;

    const sizeSelect = document.getElementById("sizeSelect");
    sizeSelect.innerHTML = '';
    for (let size in good.sizes) {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = `${size} - ₹${good.sizes[size]}`;
      sizeSelect.appendChild(option);
    }

    updatePrice(index, sizeSelect.value, 1);
    document.getElementById("orderModal").style.display = "block";
  };

  window.closeModal = function() {
    document.getElementById("orderModal").style.display = "none";
  };

  document.getElementById("orderQty").addEventListener("input", function () {
    const index = document.getElementById("modalOrderForm").dataset.index;
    const size = document.getElementById("sizeSelect").value;
    updatePrice(index, size, this.value);
  });

  document.getElementById("sizeSelect").addEventListener("change", function () {
    const index = document.getElementById("modalOrderForm").dataset.index;
    const qty = document.getElementById("orderQty").value;
    updatePrice(index, this.value, qty);
  });

  function updatePrice(index, size, qty) {
    const good = goods[index];
    const unitPrice = good.sizes[size];
    const total = unitPrice * qty;
    document.getElementById("priceDetails").textContent = `Total Price: ₹${total}`;
  }

  document.getElementById("modalOrderForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const index = this.dataset.index;
    const good = goods[index];
    const customerName = document.getElementById("customerName").value;
    const qty = parseInt(document.getElementById("orderQty").value);
    const size = document.getElementById("sizeSelect").value;
    const location = document.getElementById("location").value;
    const totalPrice = good.sizes[size] * qty;

    // Save order with date and status
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
      name: customerName,
      itemName: good.name,
      size: size,
      qty: qty,
      total: totalPrice,
      location: location,
      date: new Date().toLocaleString(),
      completed: false
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    alert(`Order placed for ${qty} x ${good.name} (${size}) - ₹${totalPrice}. We’ll contact you soon.`);
    e.target.reset();
    closeModal();
  });
});
