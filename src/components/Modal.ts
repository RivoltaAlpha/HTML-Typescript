import { CartService } from "../services/CartActions";

export async function renderCart(cart: CartService) {
  const cartContainer = document.querySelector(".cart-items");
  const totalEl = document.getElementById("cart-total");
  const itemCountEl = document.getElementById("item-count");
  const confirmBtn = document.getElementById("confirm-order") as HTMLButtonElement;
  const emptyCartImg = document.getElementById("empty-cart-img");

  if (!cartContainer || !totalEl || !itemCountEl) return;

  cartContainer.innerHTML = "";

  const items = await cart.getItems();
  const totalPrice = await cart.getTotalPrice();
  const itemCount = await cart.getTotalItems();

  // Update item count
  itemCountEl.textContent = itemCount.toString();

  if (items.length === 0) {
    // Show empty cart state
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <img src="./assets/images/illustration-empty-cart.svg" alt="Empty cart" id="empty-cart-img">
        <p>Your added items will appear here</p>
      </div>
    `;
    confirmBtn.style.display = "none";
    if (emptyCartImg) emptyCartImg.style.display = "block";
  } else {
    // Show cart items
    if (emptyCartImg) emptyCartImg.style.display = "none";
    confirmBtn.style.display = "block";

    items.forEach(({ product, quantity }) => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <div class="cart-item-info">
          <h4 class="cart-item-name">${product.name}</h4>
          <div class="cart-item-details">
            <span class="cart-item-quantity">${quantity}x</span>
            <span class="cart-item-unit-price">@ $${product.price.toFixed(2)}</span>
            <span class="cart-item-total">$${(product.price * quantity).toFixed(2)}</span>
          </div>
        </div>
        <button class="remove-item-btn" data-id="${product.id}">
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" fill="#CAAFA7"><path d="M8.375 0L10 1.625l-8.375 8.375L0 8.375 8.375 0Z"/><path d="M0 1.625L1.625 0l8.375 8.375L8.375 10 0 1.625Z"/></svg>
        </button>
      `;
      cartContainer.appendChild(div);
    });

    // Add carbon neutral delivery notice
    const deliveryNotice = document.createElement("div");
    deliveryNotice.className = "delivery-notice";
    deliveryNotice.innerHTML = `
      <svg width="21" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M8 18.75H6.125V17.5H8V9.729L5.803 8.41l.644-1.072 2.196 1.318a1.256 1.256 0 0 1 .607 1.072V17.5A1.25 1.25 0 0 1 8 18.75Z" fill="#1EA575"/><path d="A2.5 2.5 0 1 1 0 2.5 2.5 2.5 0 0 1 0 2.5Z" fill="#1EA575"/></svg>
      <span>This is a <strong>carbon-neutral</strong> delivery</span>
    `;
    cartContainer.appendChild(deliveryNotice);
  }

  totalEl.textContent = `Order Total $${totalPrice.toFixed(2)}`;

  // Add event listeners for remove buttons
  cartContainer.querySelectorAll(".remove-item-btn").forEach(btn =>
    btn.addEventListener("click", async (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest(".remove-item-btn") as HTMLButtonElement;
      const id = Number(button?.dataset.id);
      await cart.removeFromCart(id);
      document.dispatchEvent(new Event("cartUpdated"));
    })
  );
}