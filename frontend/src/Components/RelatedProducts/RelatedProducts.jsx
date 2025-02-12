import React from 'react';
import './RelatedProducts.css';
import data_product from '../Assets/data';
import Item from '../Item/Item';
export const RelatedProducts = () => {
  return (
    <div className='relatedproducts'>
        <h1>Related Products</h1> {/* Fixed the typo in the heading */}
        <hr />
        <div className='relatedproducts-items'>
            {data_product.map((item, i) => (
              <Item 
                key={i} 
                id={item.id} 
                name={item.name} 
                image={item.image} 
                new_price={item.new_price} 
                old_price={item.old_price} 
              />
            ))}
        </div>
    </div>
  );
};

export default RelatedProducts;
