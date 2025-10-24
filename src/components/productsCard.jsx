import { useState } from "react";
import Container from "./container";

import { TfiMoreAlt } from "react-icons/tfi";
import { FaTag } from "react-icons/fa";
import { useStatment } from "../context/maping";

const ProductsCard = ({products}) => {
  // const [products, setProducts] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const {
    setShowAlert,
    setDeleteitems,
   

    setProductDetails,
    setEditShowProduct,
  } = useStatment();


 

  return (
    <div className="w-full mt-6 h-full flex justify-center items-center">
      <Container>
        <div className="w-full h-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#ffffff16] w-[1fr] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#ffffff4e] overflow-hidden"
                >
                  <div className="relative">
                    <div className="absolute top-3 right-3 z-10">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowMenu(
                              showMenu === product.id ? null : product.id
                            )
                          }
                          className="p-2 bg-white/90 cursor-pointer backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                        >
                          <TfiMoreAlt />
                        </button>

                        {showMenu === product.id && (
                          <div className="absolute top-full right-0 mt-2 bg-[#00000091] backdrop-blur rounded-lg shadow-lg border border-[#ffffff4e] py-2 min-w-[120px]">
                     
                            <button 
                            onClick={() => {
                              setProductDetails(product);
                              setEditShowProduct(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-[#ffffff38] hover:backdrop-blur  w-full text-right">
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteitems({
                                  id: product.id,
                                  name: "product",
                                });
                                setShowAlert(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-[#ffffff38] hover:backdrop-blur w-full text-right"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`flex r justify-center items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          product.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.active ? "active" : "not active"}
                      </span>
                    </div>

                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <img
                          src={`http://localhost:4000/${product.images[0]?.link}`}
                          alt={product.name}
                          className="w-full  object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      <FaTag size={14} className="text-white" />
                      <span className="text-sm text-blue-600 font-medium">
                        {product.category_name}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-lg text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-green-600 text-lg">
                        ${product.price}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          product.stock > 10
                            ? "text-green-600"
                            : product.stock > 0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </div>

                    {/* Colors */}
                    {product.options?.[0]?.color && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-white/70  ml-2">
                          Colors:
                        </span>
                        <div className="flex gap-1">
                          {product.options[0].color.map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {product.options?.[0]?.size ? (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs block text-white/70  ml-2">
                          sizes:
                        </span>
                        <div className="flex gap-1">
                          {product.options[0].size.map((size, index) => (
                            <div
                              key={index}
                              className="p-1 rounded-[3px] text-white/40 text-[9px] border-1 border-gray-300"
                              title={size}
                            >
                              {size}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs block text-white/70  ml-2">
                          sizes:
                        </span>
                        <div className="flex gap-1">
                          <div className="p-1 rounded-[3px] text-white/40 text-[9px] ">
                            No size
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-[#ffffff4e]">
                      <span>{product.created_at.split("T")[0]}</span>
                      <span>ID: {product.id}</span>
                    </div>

                    {/* Availability Status */}
                    <div className="mt-3">
                      <span
                        className={`inline-block w-full text-center py-2 rounded-lg text-sm font-medium ${
                          product.available
                            ? "bg-[#d1e7dd2e] backdrop-blur-sm text-[#00ff5e] border border-[#00ff5e]"
                            : "bg-[#f8d7da2e] backdrop-blur-sm text-red-700 border border-red-200"
                        }`}
                      >
                        {product.available ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                No Products
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductsCard;
