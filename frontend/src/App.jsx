import React, { useState, useEffect } from 'react';
import { getItems, createItem, updateItem, deleteItem } from './api';
import './index.css';


export default function App() {

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState ({
    name: '',
    description: '',
    price: '',
    in_stock: true,
  });

  const [editingID, setEditingID] = useState(null);
  useEffect(() => {
    fetchItems();


  }, []);


  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getItems();
      setItems(response.data);
    } catch (error){
      console.error(error);
      setError('Failed to fetch items');
    } finally {
      setLoading(false);

    }
   
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);



      if (!formData.name.trim() || !formData.price){
        setError('Name and Price are required');
        return;
      }

      try{
        if (editingID) {
          await updateItem(editingID, formData);

        } else {
          await createItem(formData);
        }
        resetForm();
        fetchItems();

      }catch (error) {
        console.error(error);
        setError('Failed to save item');
      }


    };

    const handleEditClick = (item) => {
      setEditingID(item.id);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        in_stock: item.in_stock,
      });
    };


    const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?'))
      return;
    try {
      await deleteItem(id);
      fetchItems();

    }catch (error) {
      console.error(error);
      setError('Failed to delete item');
    }
    
    
    };


    const resetForm = () => {
      setFormData({name: '', description: '', price: '', in_stock: true});
      setEditingID(null);
    };

 
 return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Django + React CRUD Table</h1>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {/* Form Section */}
      <section style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>{editingID ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <input
              type="text"
              name="name"
              placeholder="Item Name *"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ flex: 1, padding: '0.5rem' }}
            />
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Price *"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={{ width: '120px', padding: '0.5rem' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="in_stock"
                checked={formData.in_stock}
                onChange={handleInputChange}
              />
              In Stock
            </label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={formData.description}
              onChange={handleInputChange}
              rows="2"
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '0.6rem 1.2rem', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
            {editingID ? 'Update Item' : 'Add Item'}
          </button>
          {editingID && (
            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: '1rem', padding: '0.6rem 1.2rem', cursor: 'pointer', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>
      {/* Data Table Section */}
      <section>
        <h2>Items Table</h2>
        {loading ? (
          <p>Loading items...</p>
        ) : items.length === 0 ? (
          <p>No items found. Create your first item above!</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#e9ecef', borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '0.75rem' }}>ID</th>
                <th style={{ padding: '0.75rem' }}>Name</th>
                <th style={{ padding: '0.75rem' }}>Description</th>
                <th style={{ padding: '0.75rem' }}>Price</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Created At</th>
                <th style={{ padding: '0.75rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '0.75rem' }}>{item.id}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.name}</td>
                  <td style={{ padding: '0.75rem' }}>{item.description || '-'}</td>
                  <td style={{ padding: '0.75rem' }}>${Number(item.price).toFixed(2)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ color: item.in_stock ? 'green' : 'red', fontWeight: 'bold' }}>
                      {item.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem' }}>
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() => handleEditClick(item)}
                      style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem', cursor: 'pointer', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.id)}
                      style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

 



 


 