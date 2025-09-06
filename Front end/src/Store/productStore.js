import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
  products: [],
  ShowProducts: async () => {
    try {
      const response = await axios.get('http://localhost:5000/AllProdacts');
      set({ products: response.data });
    } catch (error) {
      console.error(error);
    }
  },

  AddProduct: async (newProduct) => {
    try {
      const formData = new FormData();
      formData.append('nameP', newProduct.nameP);
      formData.append('priceP', newProduct.priceP);
      formData.append('image', newProduct.imgP);
      const response = await axios.post(
        'http://localhost:5000/addProdact',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      // Optionally, you can refresh the product list after adding a new product

      set((state) => ({
        products: [...state.products, response.data],
      }));
    } catch (error) {
      console.error('Error adding product:', error);
    }
  },

  EditProduct: async (newProduct) => {
    console.log('in store', newProduct);
    try {
      const formData = new FormData();
      formData.append('nameP', newProduct.nameP);
      formData.append('priceP', newProduct.priceP);

      if (newProduct.imgP instanceof File) {
        formData.append('image', newProduct.imgP);
      }

      let result = await axios.patch(
        `http://localhost:5000/Update/${newProduct.id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      const pr = result.data;
      set((state) => ({
        products: state.products.map((product) =>
          product.id === pr.id ? pr : product
        ),
      }));
    } catch (error) {
      console.error('Error adding  new product:', error);
    }
  },

  DeleteProdect: async (id) => {
    try {
      let result = await axios.delete(`http://localhost:5000/delete/${id}`);
      console.log(result.data);
    } catch (error) {
      console.error('no:', error);
    }

    set((state) => ({
      products: state.products.filter((p) => p.id != id),
    }));
  },
}));

export default useProductStore;
