# Currency Exchange API

This project is a simple currency exchange API built with Next.js. The API provides exchange rates between supported currencies and allows users to convert a base amount from one currency to another. The API also implements an LRU (Least Recently Used) cache to store recent exchange rates to optimize performance.

## Features

- Fetches exchange rates between supported currencies.
- Converts a base amount from one currency to another.
- Uses an LRU cache to store and retrieve recent exchange rates for improved efficiency.
- Supports USD, EUR, GBP, and ILS as base and quote currencies.

## Technologies

-  **Next.js** for building API routes and small frontend.
-  **Axios** for making HTTP requests to the external currency exchange API.
-  **LRU Cache** for caching recent exchange rates and reducing unnecessary external API calls.

## Supported Currencies

- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- ILS (Israeli Shekel)

## Prerequisites

Before running this project locally, make sure you have the following installed:

- Node.js 
- npm or yarn (to install dependencies)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ValdasT/currency-exchange.git
cd currency-exchange
```

2. Install the required dependencies:

```bash
npm install
```

or, if you're using `yarn`:

```bash
yarn install
```

3. Create a `.env.local` file in the root directory to configure your environment variables. Add the following content:

```bash
EXCHANGE_API_URL=<Your external API URL>
```

Replace `<Your external API URL>` with the actual URL of the exchange rates API you are using. (Recommended to use: https://api.exchangerate-api.com/v4/latest/USD)

## Running the Application Locally

1. Start the development server:

```bash
npm run dev
```
or, if you're using `yarn`:

```bash
yarn dev
```

2. Open your browser and navigate to `http://localhost:3000`.

### Example API Request

To fetch the exchange rate and convert an amount, you can use the following endpoint:

-  **GET**  `/api/quote?baseCurrency=USD&quoteCurrency=EUR&baseAmount=100`

-  `baseCurrency`: The currency you're converting from (e.g., USD).
-  `quoteCurrency`: The currency you're converting to (e.g., EUR).
-  `baseAmount`: The amount you're converting.

### Example Response:

```json
{
"exchangeRate": "0.850",
"quoteAmount": 85
}
```

### Swagger Documentation:
This application includes a Swagger API documentation. The Swagger documentation provides details about the API endpoints, parameters, and responses.
Access the Swagger documentation at http://localhost:3000/swagger

## Running Tests

You can run the unit tests using the following command:

```bash
npm  test
```

or, if you're using `yarn`:

```bash
yarn  test
```
