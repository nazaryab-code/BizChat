import React, { useState, useEffect } from 'react';
import '../styles/profile.css';
import userImage from '../styles/user1.png';

const UserProfile = ({ user }) => {
  const [showTransaction, setShowTransaction] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  const handleToggleTransaction = () => {
    setShowTransaction(!showTransaction);
    setShowOrder(false);
  };

  const handleToggleOrder = () => {
    setShowOrder(!showOrder);
    setShowTransaction(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoResponse = await fetch('http://192.168.1.50:1234/api/getUserInfoByName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ full_name: user }),
        });

        if (!userInfoResponse.ok) {
          throw new Error(`User Info HTTP error! Status: ${userInfoResponse.status}`);
        }

        const userInformation = await userInfoResponse.json();
        setUserInfo(userInformation);

        if (showTransaction) {
          const transactionsResponse = await fetch('http://192.168.1.50:1234/api/userTransactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ full_name: user }),
          });

          if (!transactionsResponse.ok) {
            throw new Error(`Transactions HTTP error! Status: ${transactionsResponse.status}`);
          }

          const userTransactions = await transactionsResponse.json();
          setTransactions(userTransactions);
        } else if (showOrder) {
          const ordersResponse = await fetch('http://192.168.1.50:1234/api/userOrderDetails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ full_name: user }),
          });

          if (!ordersResponse.ok) {
            throw new Error(`Orders HTTP error! Status: ${ordersResponse.status}`);
          }

          const userOrderDetails = await ordersResponse.json();
          setOrders(userOrderDetails);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user, showTransaction, showOrder]);

  return (
    <div className="profile-card">
      <div className="profile-cover"></div>
      <div className="profile-image-container">
        <div className="profile-image">
          <img src={userImage} alt="" />
        </div>
      </div>
      <h1 className="profile-name">{user}</h1>
      <div className="scrollable-content">
        <table className="profile-details">
          <tbody>
            <tr>
              <td>Email</td>
              <td className="table-cell-ellipsis">: {userInfo.email}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td className="table-cell-ellipsis">: {userInfo.phone}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td className="table-cell-ellipsis">: {userInfo.address}</td>
            </tr>
            <tr>
              <td>Country</td>
              <td>: {userInfo.country}</td>
            </tr>
            <tr>
              <td>Project</td>
              <td className="table-cell-ellipsis">: {userInfo.project}</td>
            </tr>
            <tr>
              <td>Invoice</td>
              <td className="table-cell-ellipsis">: {userInfo.invoice}</td>
            </tr>
            <tr>
              <td>Deadline</td>
              <td className="table-cell-ellipsis">: {userInfo.deadline}</td>
            </tr>
            <tr>
              <td>Budget</td>
              <td className="table-cell-ellipsis">: {userInfo.budget}</td>
            </tr>
          </tbody>
        </table>
        <div className="profile-footer">
          <hr />
          <div className="button-container">
            <button
              className={`btn btn-link ${showTransaction ? 'active' : ''}`}
              onClick={handleToggleTransaction}
            >
              <i className="fa fa-university" aria-hidden="true"></i> Transaction
            </button>
            <button
              className={`btn btn-link ${showOrder ? 'active' : ''}`}
              onClick={handleToggleOrder}
            >
              <i className="fa fa-shopping-cart" aria-hidden="true"></i> Order
            </button>
          </div>
          {showTransaction && (
            <div className="">
              <h2>Transaction Details</h2>
              <table className="table table-hover full-width-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{transaction.product}</td>
                      <td>{transaction.date}</td>
                      <td>{transaction.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {showOrder && (
            <div className="">
              <h2>Order Details</h2>
              <table className="table table-hover full-width-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {orders.map((order, index) => (
                      <tr key={index + 1}>
                        <td>{index + 1}</td>
                        <td>{order.product}</td>
                        <td>{order.quantity}</td>
                        <td>{order.status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
