import { CartService } from "../services/CartActions";
import type { Product } from "../types";

export function createProductCard(product: Product, cart: CartService): HTMLElement {
  const div = document.createElement("div");
  div.className = "card";
//   <img src="${product.image.desktop}" alt="${product.name}">

  div.innerHTML = `
    <picture>
        <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
        <source media="(min-width: 768px)" srcset="${product.image.tablet}">
        <img src="${product.image.mobile}" alt="${product.name}">
    </picture>
    <button>Add to Cart</button>
    <p>${product.category}<p/>
    <h4>${product.name}</h4>
    <p price >$${product.price.toFixed(2)}</p>
  `;

  const button = div.querySelector("button")!;
    button.addEventListener("click", async () => {
    await cart.addToCart(product);
    button.textContent = "Added to Cart";
    document.dispatchEvent(new Event("cartUpdated"));
    });

    return div;
    }
