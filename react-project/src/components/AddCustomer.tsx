import React, { useState } from 'react';

function AddCustomer() {
    const [customer, setCustomer] = useState({id:"", name:"", email:"", password:""});
    // const [id, setId] = useState("");
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    //let customer = {id:"", name:"", email:"", password:"",};
    return(
        <div className='page'>
            <h2>Add Customer</h2>
            <form>
                <div>
                    <label htmlFor="id">ID:</label>
                    <input
                        type="text"
                        id="id"
                        placeholder="Enter id"
                        value={customer.id}
                        onChange={(e) => setCustomer({...customer, id: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    />
                </div>
                <div>

                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Enter your email"
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="text"
                        id="Password"
                        placeholder="Enter your password"
                        value={customer.password}
                        onChange={(e) => setCustomer({...customer, password: e.target.value})}
                    />
                </div>

                <button type="submit" onClick={()=>setCustomer({id:customer.id, name:customer.name, email:customer.email, password:customer.password})}>Add Customer</button>
            </form>
        </div>
    )
}

export default AddCustomer;