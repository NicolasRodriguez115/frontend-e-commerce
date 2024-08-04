import React, {useState, useEffect} from "react";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import { useParams, useNavigate } from "react-router-dom";

function ProductForm( {onProductUpdated} ){
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [error, setError] = useState('');
  const { id } = useParams(); // We want to get the product ID from the URL 
  const navigate = useNavigate(); 

  useEffect(() => {
    // Update a product 
    if (id) {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:5001/products/${id}`);
          setName(response.data.name); 
          setPrice(response.data.price); 
        } catch (error) {
          console.error(`Error fetching product details: ${error}`);
          setError(error.toString()); 
        }
      }
      fetchProductDetails(); 
    }
  }, [id])

  // Function to validate the form 
  const validateForm = () => {
    const errors = { name: "", price: ""}; 

    if (!name) {
      errors.name = 'Product name is required';
    } 
    
    if (!price || price <= 0){
      errors.price = 'Price must be a positive number'; 
    }

    console.log("Error name:", errors.name);
    console.log("Error price:", errors.price)

    return errors 
  }
 
  // Function to handle user submitting the form 
  const handleSubmit = async (event) => {

    // Prevent the form from glitching 
    event.preventDefault(); 

    // Validate the form 
    const errors = validateForm(); 

    console.log("Errors length", Object.keys(errors) === 0);
  
    // Check if the form has any errors - proceed if all values are good 
    if (Object.keys(errors).length === 0){

      // Signal that we are doing something with the data (ie. loading wheel)
      setIsSubmitting(true);

      // Set error to null - we got the data from the API 
      setError(null);

      const productData = {name, price}; 

      try {
        // Update existing product 
        if (id) {
          await axios.put(`http://127.0.0.1:5001/products/${id}`, productData)
        } 

        // Create new product 
        else {
          await axios.post('http://127.0.0.1:5001/products', productData);
        }

        // Reset the form after updating/creating the product 
        setName('');
        setPrice(''); 

        // Finish loading wheel
        setIsSubmitting(false); 


      } catch (error) {
        console.error("Error submitting the product:", error);
        setError(error.toString());
        setIsSubmitting(false); 
      }

    } else {
      setErrors(errors)
    }
    
  };

  if (isSubmitting) return <p>Submitting product data...</p>
  if (error) return <p>Error submitting product data: {error}</p>

  return (
    <div className="product-form">
      <NavigationBar />
      <form onSubmit={handleSubmit}>
        <h3>{id ? `Edit` : `Add`} Products</h3>
        <label>
          Name: 
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          {errors.name && <div style={{color: 'red'}}>{errors.name}</div>}
        </label>

        <br />

        <label>
          Price: 
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          {errors.price && <div style={{color: 'red'}}>{errors.price}</div>}
        </label>

        <br />

        <button type="submit">Submit</button>

      </form>
    </div>
  )


}

export default ProductForm; 