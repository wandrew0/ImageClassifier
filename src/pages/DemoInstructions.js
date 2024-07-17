import React from 'react';
import "../css/styles.css";
import BlueLink from './BlueLink';
function DemoInstructions() {
  return (
    <div className='demo-instructions'>
      
      <p>Welcome to the MoneyWatcher demo! 
        Our server is currently connected to Plaid's sandbox environment, 
        where we've set up multiple test bank accounts complete with simulated transactions for a comprehensive demonstration experience.</p>
      
      <h3>Getting Started:</h3>
      <ol>
        <li>
          <BlueLink to="/signup" text="Sign Up " /> or <BlueLink to="login" text="Log In " /> to access the demo application.
        </li>
        <br />
        <li>
          <BlueLink to="/add_item" text="Select Test Accounts:" /> Choose one or more test bank accounts to add to your demo. This step enables you to explore transaction histories and account features without real-world financial implications.
        </li>
        <br />
        <li>
          <BlueLink to="/Transaction" text="View Transactions:" /> Once you've added the bank accounts, navigate to the transactions page. Here, you can review detailed transaction data, analyze spending patterns, and gain insights into financial habits.
        </li>
        <br />
        <li>
          <BlueLink to="/Merchant" text="View/Update Merchants and Merchant Types:"/> The Merchant page allows you to view and update
          all your merchants' type. You also have the option to create user-defined merchant types and update the type of any merchant.
           You can view transactions or create alerts based on any merchant type. (including user-defined type)
        </li>
        <br />
        <li>
            <BlueLink to="/Rule" text="Confgure Alert Rule:" /> Visit the rules page to set up spending alerts. 
            This feature allows you to create personalized notifications based on specific spending behaviors, 
            helping you manage finances more effectively.
        </li>
        <br />
        <li>
            <BlueLink to="/Alert" text="View Alerts:" />The Alert page shows all alerts triggered by the rules. 
        </li>
      </ol>
      
      <p>Experience the Full Capabilities of MoneyWatcher:</p>
      <p>Our sandbox environment is designed to provide a realistic yet secure platform for you to explore MoneyWatcher's features. Whether you're looking to understand transaction flows or set up financial alerts, our test accounts offer a comprehensive overview of what MoneyWatcher can do.</p>
      
      <p>Start exploring today and discover how MoneyWatcher can transform your financial management experience!</p>
    </div>
  );
}

export default DemoInstructions;
