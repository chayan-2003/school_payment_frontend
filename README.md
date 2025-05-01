# Frontend Documentation Index
### **Frontend Documentation Index**

1. **Setup**  
2. **Explanation of Each Page**  
   - Responsive Layout Previews  
   - Component Structure  
   - Flow Summary  

3. **Key Considerations**  



# Setup and Installation Instructions

Follow these steps to set up and run the **Payment Frontend** project locally.

---

## Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v16 or later)
- **npm** or **yarn** (npm comes with Node.js)
- A modern web browser (e.g., Chrome, Firefox)

---

## Installation Steps

### 1. Clone the Repository
Clone the project repository to your local machine:
```bash
git clone https://github.com/your-username/payment-frontend.git
```

### 2. Navigate to the Project Directory
Move into the project folder:
```bash
cd payment-frontend
```

### 3. Install Dependencies
Install the required dependencies using npm or yarn:
```bash
npm install
# or
yarn install
```

### 4. Set Up Environment Variables
Create a `.env` file in the root directory and configure the required environment variables. Use the following format:
```properties
VITE_API_BASE_URL=https://school-payment-microservice.onrender.com
```



---

## Running the Application

### 1. Start the Development Server
Run the following command to start the development server:
```bash
npm run dev
# or
yarn dev
```

### 2. Open in Browser
Once the server starts, open your browser and navigate to:
```
http://localhost:5173
```

---

## Build for Production

To build the application for production, run:
```bash
npm run build
# or
yarn build
```

The production-ready files will be generated in the `dist` folder.

---

## Linting and Formatting

### Run Linter
To check for code quality issues, run:
```bash
npm run lint
# or
yarn lint
```

### Format Code
To format the codebase, run:
```bash
npm run format
# or
yarn format
```

---

## Available Routes

| Route                     | Description                              |
|---------------------------|------------------------------------------|
| `/`                       | Home Page                               |
| `/login`                  | Login Page                              |
| `/register`               | Registration Page                       |
| `/dashboard`              | Main Dashboard                          |
| `/transactions`           | Transaction List Page                   |
| `/transactions-by-school` | Transactions Filtered by School         |
| `/transaction-status`     | Transaction Status Lookup Page          |
| `/transaction-dashboard`  | Transaction Analytics Dashboard         |
| `/payment`                | Payment Page                            |

---




## Transaction Table Page Overview

### Responsive Layout Previews

The Transaction Table page is designed to be fully responsive across different screen sizes. Below are screenshots showing how the layout adapts:

| Orientation | Screenshot |
|-------------|------------|
| Desktop View (Light) | ![](https://i.ibb.co/8LLXqZ44/Transaction-Table-Light-Desktop-png.png) |
| Desktop View (Dark) | ![](https://i.ibb.co/4Zj4CZsg/Transaction-Table-Dark-Desktop-png.png)|
| Mobile View (Light) | ![](https://i.ibb.co/ZzLctsML/Transaction-Light-Mode-Mobile-png.png) |

### Component Structure

The page consists of the following components:

#### 1. Filter Component
- This component allows users to apply filters such as date range, category, or type.
- It updates the URL with query parameters reflecting the current filter state.
- These filters are used to control the data shown in the Transaction Table.

#### 2. Transaction Table Component
- This component reads the current filter values from the URL.
- Based on those filters, it updates and renders the transaction data.
- Each change in the filter results in a new view of the data being shown.

#### 3. Transaction Service
- This component handles data fetching.
- It receives the current filter values and fetches corresponding transactions.
- It abstracts the data retrieval logic and serves as the interface between the frontend and the backend or mock data source.

### Flow Summary

1. The user applies filters through the Filter component.
2. The URL is updated with the current filter state.
3. The Transaction Table reads the URL and requests data accordingly.
4. The Transaction Service fetches the filtered data.
5. The table updates with the new transaction records.
6. Got it! Here's a refined summary for your GitHub README, starting with the responsive layout and summarizing the core functionality:

---

# Transactions by School - Page Overview

This page allows users to view transactions for a selected school. The design is fully responsive and adapts to various screen sizes. Below is an overview of the page, including responsive layouts, component structure, and the flow of data.

## Responsive Layout Previews

The `Transactions by School` page is designed to work seamlessly across different screen sizes. Here are the layout previews:

| Orientation | Screenshot |
|-------------|------------|
| Desktop View (Dark) | ![](https://i.ibb.co/vxjWZ5t8/Screenshot-2025-04-30-190443.png)|
| Desktop View (Light) | ![](https://i.ibb.co/PGvYzWdF/Screenshot-2025-04-30-185841.png)|
## Component Structure

### 1. **Filter Component**
- Allows users to filter transactions by school.
- Updates the page URL with the selected filter state.
- Used to control which transactions are displayed in the table.

### 2. **Transaction Table Component**
- Reads filter values from the URL.
- Fetches and displays transaction data based on the selected filter values.

### 3. **Transaction Service**
- Handles the fetching of transaction data.
- Acts as an interface between the frontend and the backend or mock data source.

## Flow Summary

1. **User applies filters** through the Filter component.
2. **URL is updated** with the current filter state.
3. The **Transaction Table** reads the URL and makes a request for filtered data.
4. The **Transaction Service** fetches the filtered transactions.
5. The **Transaction Table** updates to display the fetched transactions.

## Key Features

- **Responsive Layout**: Fully optimized for desktop and mobile views.
- **User Authentication**: Verifies user authentication before loading the page.
- **Theme Toggle**: Allows users to toggle between light and dark themes.
- **Transaction Fetching**: Displays transactions based on the selected school, with loading and error handling.

Here’s the clean, professional version without any emojis or embellishments for your `TransactionStatusPage` section of the README:

---

## Transaction Status - Page Overview

This page enables users to check the status of a transaction using a Custom Order ID. The layout is fully responsive and includes user feedback through status icons, loading indicators, and error messages.

### Responsive Layout Previews

| Orientation | Screenshot |
|-------------|------------|
| Desktop View (Light) | ![](https://i.ibb.co/XxSrHDYt/Screenshot-2025-04-30-193413.png) |
| Tablet View (Light) | ![](https://i.ibb.co/d01Dx69h/Screenshot-2025-04-30-193439.png) |
| Mobile View (Dark) | ![](https://i.ibb.co/MDp1PL7R/Screenshot-2025-04-30-193851.png) |




1. **Order ID Input and Submit Button**  
   Allows the user to input a custom order ID to fetch transaction data.

2. **Transaction Display Section**  
   Renders transactions with status, amount, gateway, and timestamp.  
   Uses visual indicators for status (Pending, Failed, Success).

3. **Transaction Service**  
   Handles API calls to fetch transaction status by order ID.  
   Implements loading and error handling logic.

### Flow Summary

1. User inputs a Custom Order ID and submits.
2. The component makes a GET request to the backend.
3. If transactions are found, they are displayed in a table.
4. If no data is found or an error occurs, the page displays a message accordingly.


---



# Transaction Analytics Dashboard - Page Overview

The **Transaction Dashboard** provides a comprehensive view of transaction data, including summaries, visualizations, and recent transaction details. The layout is fully responsive and supports both light and dark themes for an optimal user experience.

---

## Key Features

1. **Summary Cards**
   - Displays key metrics such as:
     - Total Transaction Amount
     - Number of Transactions
     - Total Registered Schools
     - Total Order Amount
   - Each card includes an icon and dynamically updates based on the fetched data.

2. **Pie Chart**
   - Visualizes the distribution of transaction statuses (e.g., Success, Pending, Failed).
   - Includes percentage labels for each status.

3. **Recent Transactions Table**
   - Lists the most recent transactions with details such as:
     - Date
     - School ID
     - Transaction Amount
   - Alternating row colors for better readability.
   - Fully responsive with horizontal scrolling for smaller screens.

4. **Line Chart**
   - Displays a year-long transaction report with monthly data.
   - Includes smooth gradients and tooltips for better data visualization.

5. **Dark Mode Support**
   - Users can toggle between light and dark themes.
   - All components dynamically adjust their styles based on the selected theme.

6. **Error and Loading States**
   - Displays loading indicators while fetching data.
   - Shows error messages if data retrieval fails.

---

## Flow Summary

1. **Data Fetching**
   - On page load, the app fetches:
     - Line chart data
     - Recent transactions
     - Transaction summary
     - Transaction status distribution
   - All data is fetched concurrently for better performance.

2. **Data Visualization**
   - The fetched data is displayed in summary cards, charts, and tables.

3. **User Interaction**
   - Users can toggle between light and dark themes.
   - The page dynamically updates based on the selected theme.

---

## Responsive Layout Previews

| Orientation | Screenshot |
|-------------|------------|
| Desktop View (Light) | ![](https://i.ibb.co/jkXknRJ3/Screenshot-2025-05-01-171427.png) |
| Mobile View (Dark) | ![](https://i.ibb.co/yBsXHXF8/Screenshot-2025-05-01-173955.png) |


---

## Components Overview

### 1. Header
- Displays the page title: **Transaction Analytics**.
- Includes a button to navigate back to the main dashboard.
- Theme toggle button for switching between light and dark modes.

### 2. Summary Cards
- Four cards showing key metrics with icons and dynamic values.

### 3. Pie Chart
- Visualizes transaction statuses with a clean and interactive design.

### 4. Recent Transactions Table
- Displays the most recent transactions in a tabular format.
- Includes hover effects and alternating row colors.

### 5. Line Chart
- Provides a year-long transaction report with monthly data.

---


---


## Payment Page Overview

The **Payment Page** allows users to securely initiate payments by providing essential details such as the School ID, Amount, and Callback URL. The page is designed with a clean and responsive layout, supporting both light and dark modes for an optimal user experience.

---

### Responsive Layout Previews

The Payment Page is fully responsive and adapts seamlessly to different screen sizes. Below are screenshots showcasing the layout:

| Orientation | Screenshot |
|-------------|------------|
| Desktop View  | ![](https://i.ibb.co/DgSt90Jq/Screenshot-2025-05-01-235948.png) |
---

### Component Structure

The page consists of the following key components:

#### 1. **Dark Mode Toggle**
- A toggle button in the top-right corner allows users to switch between light and dark modes.
- The theme preference is saved in `localStorage` and applied automatically on subsequent visits.

#### 2. **Payment Form**
- The form includes the following fields:
  - **School ID**: Input field for entering the school identifier.
  - **Amount**: Input field for specifying the payment amount.
  - **Callback URL**: Input field for providing the callback URL to handle payment responses.
- Each field is styled with floating labels for a modern and user-friendly design.
- The form validates user input and ensures all fields are filled before submission.

#### 3. **Submit Button**
- A visually appealing button labeled **"Pay Now"** initiates the payment process.
- The button includes a loading spinner when the payment is being processed.

#### 4. **Background and Overlay**
- A visually rich background image with a gradient overlay enhances the page's aesthetics.
- The overlay ensures readability of the content while maintaining a professional look.

---

### Flow Summary

1. **User Input**:
   - The user fills in the required fields: School ID, Amount, and Callback URL.

2. **Payment Submission**:
   - Upon clicking the **"Pay Now"** button, the form data is sent to the backend API (`/create-payment`).
   - The API generates a payment request and returns a `collect_request_url`.

3. **Redirection**:
   - The user is redirected to the `collect_request_url` to complete the payment process.

4. **Error Handling**:
   - If the payment request fails, an error message is displayed using the `toast` notification system.

---

### **Key Considerations**

1. **Multiple Transactions for a Single Order**:  
   - Transactions are an aggregation of `Order` and `OrderStatus`.  
   - Due to this relationship, there may be multiple `OrderStatus` entries for the same `Order`, resulting in multiple transactions associated with a single `customOrderId`.  

2. **Custom Order ID Format**:  
   - The `customOrderId` is designed for ease of understanding and follows a sequential format, such as `ORD-1001`, `ORD-1002`, etc.  
   - This field provides a user-friendly way to identify orders.  

3. **Service Layer Functions**:  
   - The service layer includes critical API logic to handle core functionalities.  
   - It also contains functions to support analytics, ensuring the system can provide insights into transaction data.  

4. **Dummy Data in Analytics**:  
   - The "Recent Transactions" table in the analytics dashboard may display data ahead of the current time due to the use of dummy data.  
   - However, the line graph showing transactions for the last year is designed to display data only up to the present date.  

5. **Frontend Loading Time**:  
   - If the loading time is slightly higher, it could be due to server-side render inactivity or delays in fetching data from the backend.  
   - Optimizations can be applied to improve responsiveness if necessary.  









