import './style.css'

import { CartService } from "./services/CartActions";
import { createProductCard } from "./components/productCard";
import { renderCart } from "./components/Modal";
import type { Product } from './types';

const cart = new CartService();

async function init() {
  const res = await fetch("data.json");
  const products: Product[] = await res.json();

  const productList = document.getElementById("product-list")!;
  products.forEach(product => {
    const card = createProductCard(product, cart);
    productList.appendChild(card);
  });

  renderCart(cart);

  document.addEventListener("cartUpdated", () => renderCart(cart));

  document.getElementById("confirm-order")?.addEventListener("click", () => {
    alert("Order confirmed!");
    cart.clearCart();
    renderCart(cart);
  });

  document.getElementById("reset-order")?.addEventListener("click", () => {
    cart.clearCart();
    renderCart(cart);
  });
}

init();
