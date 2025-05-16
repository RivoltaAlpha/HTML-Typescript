import { CartService } from "../services/CartActions";

export async function renderCart(cart: CartService) {
  const cartContainer = document.querySelector(".cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!cartContainer || !totalEl) return;

  cartContainer.innerHTML = "";

  const items = await cart.getItems(); // 
  const totalPrice = await cart.getTotalPrice(); 

  items.forEach(({ product, quantity }) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${product.name} x${quantity}</span>
      <span>
        <button class="decrease" data-id="${product.id}">-</button>
        <button class="increase" data-id="${product.id}">+</button>
        <button class="remove" data-id="${product.id}">x</button>
      </span>
    `;
    cartContainer.appendChild(div);
  });

  totalEl.textContent = `Total: $${totalPrice.toFixed(2)}`;

  cartContainer.querySelectorAll(".decrease").forEach(btn =>
    btn.addEventListener("click", async (e) => {
      const id = Number((e.target as HTMLElement).dataset.id);
      const items = await cart.getItems(); // Re-fetch
      const currentQty = items.find(i => i.product.id === id)?.quantity || 0;
      cart.updateQuantity(id, currentQty - 1);
      document.dispatchEvent(new Event("cartUpdated"));
    })
  );

  cartContainer.querySelectorAll(".increase").forEach(btn =>
    btn.addEventListener("click", async (e) => {
      const id = Number((e.target as HTMLElement).dataset.id);
      const items = await cart.getItems();
      const currentQty = items.find(i => i.product.id === id)?.quantity || 0;
      cart.updateQuantity(id, currentQty + 1);
      document.dispatchEvent(new Event("cartUpdated"));
    })
  );

  cartContainer.querySelectorAll(".remove").forEach(btn =>
    btn.addEventListener("click", (e) => {
      const id = Number((e.target as HTMLElement).dataset.id);
      cart.removeFromCart(id);
      document.dispatchEvent(new Event("cartUpdated"));
    })
  );

  // confirm 
}
