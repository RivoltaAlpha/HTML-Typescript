import { CartService } from "../services/CartActions";

export function createOrderModal(cart: CartService): HTMLElement {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.id = "order-modal";

  modalOverlay.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" fill="#1EA575"/>
            <path d="M18 24L22 28L30 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>Order Confirmed</h2>
        <p>We hope you enjoy your food!</p>
      </div>
      
      <div class="modal-order-items">
        <!-- Order items will be inserted here -->
      </div>
      
      <div class="modal-total">
        <span>Order Total</span>
        <span class="total-amount"></span>
      </div>
      
      <button class="start-new-order-btn">Start New Order</button>
    </div>
  `;

  return modalOverlay;
}

export async function showOrderModal(cart: CartService) {
  const modal = createOrderModal(cart);
  const orderItemsContainer = modal.querySelector(".modal-order-items")!;
  const totalAmountEl = modal.querySelector(".total-amount")!;
  const startNewOrderBtn = modal.querySelector(".start-new-order-btn")!;

  // Get cart items and total
  const items = await cart.getItems();
  const totalPrice = await cart.getTotalPrice();

  // Populate order items
  orderItemsContainer.innerHTML = "";
  items.forEach(({ product, quantity }) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "modal-order-item";
    itemDiv.innerHTML = `
      <div class="item-info">
        <img src="${product.image.thumbnail}" alt="${product.name}" class="item-thumbnail">
        <div class="item-details">
          <h4>${product.name}</h4>
          <div class="item-pricing">
            <span class="item-quantity">${quantity}x</span>
            <span class="item-unit-price">@ $${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div class="item-total">$${(product.price * quantity).toFixed(2)}</div>
    `;
    orderItemsContainer.appendChild(itemDiv);
  });

  // Set total
  totalAmountEl.textContent = `$${totalPrice.toFixed(2)}`;

  // Add event listener for start new order
  startNewOrderBtn.addEventListener("click", () => {
    cart.clearCart();
    document.body.removeChild(modal);
    document.dispatchEvent(new Event("cartUpdated"));
    // Reset all product cards to show "Add to Cart" buttons
    document.querySelectorAll(".card").forEach(card => {
      const addBtn = card.querySelector(".add-to-cart-btn") as HTMLElement;
      const quantityControls = card.querySelector(".quantity-controls") as HTMLElement;
      if (addBtn && quantityControls) {
        addBtn.style.display = "flex";
        quantityControls.style.display = "none";
        card.classList.remove("in-cart");
      }
    });
  });

  // Add modal to body
  document.body.appendChild(modal);

  // Add click outside to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}