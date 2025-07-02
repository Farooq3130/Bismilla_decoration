document.getElementById("addGoodsForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("goodName").value;
  const imageInput = document.getElementById("goodImage");
  const sizeString = document.getElementById("goodSizes").value;
  const qty = document.getElementById("goodQty").value;
  const desc = document.getElementById("goodDesc").value;
  const file = imageInput.files[0];
  if (!file) return alert("Please select an image");

  const sizes = {};
  sizeString.split(",").forEach(pair => {
    const [size, price] = pair.split(":");
    sizes[size.trim()] = parseInt(price.trim());
  });

  const reader = new FileReader();
  reader.onload = function () {
    const base64Image = reader.result;

    let goods = JSON.parse(localStorage.getItem("goods")) || [];
    goods.push({ name, image: base64Image, sizes, qty, desc });
    localStorage.setItem("goods", JSON.stringify(goods));

    alert("Good added successfully!");
    document.getElementById("addGoodsForm").reset();
    renderGoodsList(); // refresh list
  };
  reader.readAsDataURL(file);
});

// Delete good by index
function deleteGood(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    let goods = JSON.parse(localStorage.getItem("goods")) || [];
    goods.splice(index, 1);
    localStorage.setItem("goods", JSON.stringify(goods));
    renderGoodsList();
  }
}

// Show existing goods
function renderGoodsList() {
  const goods = JSON.parse(localStorage.getItem("goods")) || [];
  const container = document.getElementById("goodsList");
  container.innerHTML = "";

  if (goods.length === 0) {
    container.innerHTML = "<p>No goods added yet.</p>";
    return;
  }

  goods.forEach((good, index) => {
    const div = document.createElement("div");
    div.className = "good-item";
    div.style.margin = "10px 0";
    div.innerHTML = `
      <strong>${good.name}</strong> - Available: ${good.qty}
      <button onclick="deleteGood(${index})" style="margin-left: 10px; color: white; background: red; border: none; padding: 5px 10px; cursor: pointer;">Delete</button>
    `;
    container.appendChild(div);
  });
}

renderGoodsList(); // Call initially
