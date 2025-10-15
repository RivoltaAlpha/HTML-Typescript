import { CartService } from "../services/CartActions";
import type { Product } from "../types";

export function createProductCard(product: Product, cart: CartService): HTMLElement {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div class="card-image-container">
      <picture>
          <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
          <source media="(min-width: 768px)" srcset="${product.image.tablet}">
          <img src="${product.image.mobile}" alt="${product.name}">
      </picture>
      <button class="add-to-cart-btn" data-product-id="${product.id}">
        <svg width="21" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="#C73B0F" fill-rule="evenodd"><path d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z" fill-rule="nonzero"/><path d="M11.549 15.026H6.358a.896.896 0 0 1 0-1.792h5.191a.896.896 0 0 1 0 1.792Zm4.302 0h-2.877a.896.896 0 0 1 0-1.792h2.877a.896.896 0 1 1 0 1.792Z"/></g></svg>
        Add to Cart
      </button>
      <div class="quantity-controls" style="display: none;" data-product-id="${product.id}">
        <button class="quantity-btn decrease-btn" data-product-id="${product.id}">
          <svg fill="#fff" width="10" height="2" xmlns="http://www.w3.org/2000/svg"><path d="M0 .375h10v1.25H0V.375Z"/></svg>
        </button>
        <span class="quantity-display">1</span>
        <button class="quantity-btn increase-btn" data-product-id="${product.id}">
          <svg fill="#fff" width="10" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M4.375 0v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25H5.625V0h-1.25Z"/></svg>
        </button>
      </div>
    </div>
    <div class="card-content">
      <p class="category">${product.category}</p>
      <h4 class="product-name">${product.name}</h4>
      <p class="price">$${product.price.toFixed(2)}</p>
    </div>
  `;

  const addToCartBtn = div.querySelector(".add-to-cart-btn") as HTMLButtonElement;
  const quantityControls = div.querySelector(".quantity-controls") as HTMLElement;
  const quantityDisplay = div.querySelector(".quantity-display") as HTMLElement;
  const decreaseBtn = div.querySelector(".decrease-btn") as HTMLButtonElement;
  const increaseBtn = div.querySelector(".increase-btn") as HTMLButtonElement;

  let currentQuantity = 0;

  const updateUI = (quantity: number) => {
    currentQuantity = quantity;
    if (quantity > 0) {
      addToCartBtn.style.display = "none";
      quantityControls.style.display = "flex";
      quantityDisplay.textContent = quantity.toString();
      div.classList.add("in-cart");
    } else {
      addToCartBtn.style.display = "flex";
      quantityControls.style.display = "none";
      div.classList.remove("in-cart");
    }
  };

  addToCartBtn.addEventListener("click", async () => {
    await cart.addToCart({ 
      ...product, 
      quantity: 1 
    } as Product);
    updateUI(1);
    document.dispatchEvent(new Event("cartUpdated"));
  });

  increaseBtn.addEventListener("click", async () => {
    const newQuantity = currentQuantity + 1;
    await cart.updateQuantity(product.id, newQuantity);
    updateUI(newQuantity);
    document.dispatchEvent(new Event("cartUpdated"));
  });

  decreaseBtn.addEventListener("click", async () => {
    const newQuantity = Math.max(0, currentQuantity - 1);
    if (newQuantity === 0) {
      await cart.removeFromCart(product.id);
    } else {
      await cart.updateQuantity(product.id, newQuantity);
    }
    updateUI(newQuantity);
    document.dispatchEvent(new Event("cartUpdated"));
  });

  return div;
}
