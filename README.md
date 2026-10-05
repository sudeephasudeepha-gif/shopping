# ShopEasy - Online Shopping Website

A basic online shopping website with product listing, cart and checkout, built with HTML, CSS, JavaScript and a Node.js backend.

## Features

- Product display page with 8 products
- Add to cart, change quantity, remove items
- Cart page with item subtotals and grand total
- Checkout page with form validation and order summary
- Order confirmation with a generated order ID
- Orders saved on the server in `orders.json`
- Responsive design with light and dark mode

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js (built-in modules only, no npm packages needed)
- Storage: browser `localStorage` for the cart, `orders.json` for orders

## Project Structure

```
shopeasy/
  server.js         Node.js server and API
  package.json
  public/
    index.html      Frontend (products, cart, checkout)
```

## How to Run

1. Install Node.js from https://nodejs.org
2. Clone or download this repository
3. Open a terminal in the project folder and run:

```
node server.js
```

4. Open http://localhost:3000 in your browser

## API Endpoints

- `GET /api/products` returns the product list
- `POST /api/orders` creates an order (the total is recalculated on the server)
- `GET /api/orders` returns all saved orders

## How It Works

1. The browser loads products from `/api/products` and shows them as cards.
2. Clicking Add to Cart stores the item in the cart, which is saved in `localStorage`.
3. The cart page shows the items and the total price.
4. At checkout, the customer details and cart are sent to `POST /api/orders`.
5. The server validates the data, calculates the total from its own prices, saves the order and returns an order ID.

## Screenshots

Add screenshots of the Product page, Cart page and Checkout page here.

## Future Improvements

- User login and order history
- Database (MongoDB or MySQL) instead of a JSON file
- Real payment gateway integration
- Product search and filters
