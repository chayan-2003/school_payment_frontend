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

### Key Features

- Responsive Layout: Adapts to different screen sizes.
- Order-based Query: Fetches transactions using a unique order ID.
- Status Indicator: Displays transaction status with visual distinction.
- Error and Loading Handling: User is informed of request states and issues.
- Theme Toggle: Supports both dark and light themes.

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

## Key Technologies Used

- **React**: For building the UI components.
- **Recharts**: For rendering the pie and line charts.
- **Tailwind CSS**: For responsive and dynamic styling.
- **React Icons**: For icons in summary cards and buttons.
- **LocalStorage**: For persisting the dark mode preference.
- **Axios**: For API calls to fetch transaction data.

---

## How to Use

1. **View Summary Metrics**
   - Check the summary cards for an overview of transaction data.

2. **Analyze Transaction Status**
   - Use the pie chart to understand the distribution of transaction statuses.

3. **Review Recent Transactions**
   - Scroll through the table to see the latest transactions.

4. **Explore Yearly Trends**
   - Use the line chart to analyze transaction trends over the past year.

5. **Toggle Theme**
   - Switch between light and dark themes using the toggle button in the header.

---








