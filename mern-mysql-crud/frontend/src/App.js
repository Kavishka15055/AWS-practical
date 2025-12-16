import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';

function App() {
    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                    <div className="container">
                        <a className="navbar-brand" href="/">MERN CRUD with MySQL</a>
                    </div>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/add" element={<AddProduct />} />
                        <Route path="/edit/:id" element={<EditProduct />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;