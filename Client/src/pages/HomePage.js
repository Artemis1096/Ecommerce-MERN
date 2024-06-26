import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices.js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart.js";
import toast from "react-hot-toast";
import SearchInput from "../components/forms/SeachInput.js";
import "../index.css";
import "../styles/home.css";
const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // get total count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
    // eslint-disable-next-line
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
    // eslint-disable-next-line
  }, [checked, radio]);

  // filtering categories
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // filter products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
    // eslint-disable-next-line
  }, [page]);

  // load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Layout title={"Shop-Now"}>
      <div id="homepage-main" className="container-fluid d-flex">
        <div className="row d-flex justify-content-between" id="wholep">
          <div className="col-md-2 order-first">
            <h4 className="text-center">Filter By Category</h4>
            <div className="filtcat">
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => {
                    handleFilter(e.target.checked, c._id);
                  }}
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>
            {/* Prices filter */}
            <h4 className=" text-center mt-3">Filter By Price</h4>

            <div className="filter-category">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Prices?.map((p) => (
                  <div className="filterprice" key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="resetbut">
              <button
                className="resetbutton"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products section */}
          <div className="col-md-10 d-flex" id="products-sec">
            <h1 className="text-center">All Products</h1>
            <div>
              <SearchInput />
            </div>
            <div className="d-flex products-card-all">
              {products?.map((p) => (
                <div
                  className="card m-2 div-of-product"
                  style={{ width: "23rem" }}
                  key={p._id}
                >
                  <div id="product-image">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top product-img-center"
                      
          
                      alt={p.name} 
                    />
                  </div>
               
                  <div className="card-body image-lower-layout">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 60)}
                    </p>
                    <p className="card-text" style={{fontWeight:"bolder"}}> ʛ {p.price}</p>
                    <div className="buttons-for-product">
                    <div>
                    <button
                      className="bttn btn--svg-small btn--add"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                     <span>More Details</span>
                    </button>
                    </div>
                    <div>
                    <button
                      className="bttn btn--svg-small btn--add"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to Cart");
                      }}
                    >
                      <span>Add to cart</span>
                    </button></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="m-2 p-3">
              {products && products.length < total && (
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading ..." : "Load more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
