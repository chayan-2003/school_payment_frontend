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




