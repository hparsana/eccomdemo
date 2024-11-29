"use client";
import React, { useEffect, useState } from "react";
import SubHeader from "../../components/about/SubHeader";
import ProductCard from "../../components/product/ProductCard";
import ReactPaginate from "react-paginate";
import { BsArrowLeft } from "react-icons/bs";
import { BsArrowRight } from "react-icons/bs";

import CustomerReview from "../../components/home/CustomerReview";
import Help_Deciding from "../../components/home/Help_Deciding";
import Footer from "../../components/common/Footer";
const ProductMain = () => {
  const [currentItemsdata, setCurrentItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        // Assuming the API response structure includes a 'products' array
        setCurrentItems(data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchItems();
  }, []);

  const itemsPerPage = 9;
  // const items = [
  //   { id: 1, banner_Text: "On Sale" },
  //   { id: 2, banner_Text: "Special Offer" },
  //   { id: 3 },
  //   { id: 4 },
  //   { id: 5, banner_Text: "On Sale" },
  //   { id: 6 },
  //   { id: 7 },
  //   { id: 8 },
  //   { id: 9 },
  //   { id: 10 },
  //   { id: 11 },
  //   { id: 12 },
  //   { id: 13 },
  //   { id: 14 },
  //   { id: 15 },
  //   { id: 16 },
  //   { id: 17 },
  //   { id: 18 },
  //   { id: 19 },
  //   { id: 20 },
  // ];
  // Add more items as needed

  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = currentItemsdata.slice(offset, offset + itemsPerPage);

  return (
    <div className="box-border p-0 m-0">
      <SubHeader title="Mattresses" />
      <div className="mt-[100px] container mx-auto">
        <div className="flex flex-wrap justify-center items-center gap-[30px]">
          {currentItems?.length === 0 ? (
            <h1 className=" text-center text-[40px] font-light">
              Product Loading...
            </h1>
          ) : (
            currentItems?.map((item, index) => (
              <ProductCard
                key={item.id}
                // banner_Text={item.banner_Text}
                index={index}
                {...item}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-[70px]">
        <ReactPaginate
          previousLabel={
            <BsArrowLeft className="w-[50px] h-[35px] text-[#000000]" />
          }
          nextLabel={
            <BsArrowRight className="w-[50px] h-[35px] text-[#000000]" />
          }
          breakLabel={"..."}
          pageCount={Math.ceil(currentItemsdata.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          previousLinkClassName={"previous"}
          nextLinkClassName={"next"}
          pageLinkClassName={"page"}
          breakLinkClassName={"break"}
        />
      </div>
      <div className="mt-[100px]">
        <CustomerReview />
      </div>
      <div className="mt-[100px]">
        <Help_Deciding />
      </div>
      <div className="mt-[100px]">
        <Footer />
      </div>
    </div>
  );
};

export default ProductMain;
