import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EditProduct = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setFetching(true);
            const response = await axios.get(`${API_URL}/products/${id}`);
            const product = response.data.data;
            
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price
            });
            
            if (product.image) {
                setCurrentImage(`${API_URL.replace('/api', '')}/uploads/${product.image}`);
            }
        } catch (err) {
            setError('Error fetching product');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setCurrentImage('');
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.price) {
            setError('Name and price are required');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            if (image) {
                data.append('image', image);
            }

            await axios.put(`${API_URL}/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Error updating product');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" />
                <p>Loading product...</p>
            </div>
        );
    }

    return (
        <Card>
            <Card.Body>
                <h2 className="mb-4">Edit Product</h2>
                
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price *</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Product Image</Form.Label>
                        {currentImage && (
                            <div className="mb-2">
                                <p>Current Image:</p>
                                <img 
                                    src={currentImage} 
                                    alt="Current" 
                                    className="upload-preview"
                                />
                            </div>
                        )}
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <p>New Image Preview:</p>
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="upload-preview"
                                />
                            </div>
                        )}
                        <Form.Text className="text-muted">
                            Leave empty to keep current image
                        </Form.Text>
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Updating...
                                </>
                            ) : 'Update Product'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditProduct;