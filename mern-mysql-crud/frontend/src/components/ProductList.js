import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://13.229.55.54/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data.data);
            setError('');
        } catch (err) {
            setError('Error fetching products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/products/${id}`);
                fetchProducts();
            } catch (err) {
                setError('Error deleting product');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" />
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product List</h2>
                <Link to="/add" className="btn btn-primary">
                    Add New Product
                </Link>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {products.length === 0 ? (
                <Alert variant="info">
                    No products found. Add your first product!
                </Alert>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col key={product.id} md={4} className="mb-4">
                            <Card className="product-card h-100">
                                {product.image && (
                                    <Card.Img
                                        variant="top"
                                        src={`${API_URL.replace('/api', '')}/uploads/${product.image}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{product.name}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text className="fw-bold text-primary">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </Card.Text>
                                    <div className="mt-auto">
                                        <Link
                                            to={`/edit/${product.id}`}
                                            className="btn btn-sm btn-warning me-2"
                                        >
                                            Edit
                                        </Link>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => deleteProduct(product.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default ProductList;