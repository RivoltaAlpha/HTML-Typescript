import './style.css'

import { CartService } from "./services/CartActions";
import { createProductCard } from "./components/productCard";
import { renderCart } from "./components/Modal";
import { showOrderModal } from "./components/OrderModal";
import type { Product } from './types';

const cart = new CartService();

async function init() {
  const res = await fetch("/data.json");
  const products: Product[] = await res.json();

  const productList = document.getElementById("product-list")!;
  products.forEach(product => {
    const card = createProductCard(product, cart);
    productList.appendChild(card);
  });

  renderCart(cart);

  document.addEventListener("cartUpdated", () => renderCart(cart));

  document.getElementById("confirm-order")?.addEventListener("click", async () => {
    await showOrderModal(cart);
  });

  document.getElementById("reset-order")?.addEventListener("click", () => {
    cart.clearCart();
    renderCart(cart);
    // Reset all product cards
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
}

init();
