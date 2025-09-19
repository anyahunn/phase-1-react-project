import React from 'react';


function AddCustomer() {
    return (
        <div className='page'>
            <h2>Add Customer</h2>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" disabled />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" disabled />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" disabled />
                </div>
                <button type="submit" disabled>Add Customer</button>
            </form>
        </div>
    );
};

export default AddCustomer;