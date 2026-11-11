import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createProduct, getAllProducts } from "../../redux/actions/product";
import { toast } from "react-toastify";

const productCategories = [
  "Solar Panels",
  "Solar Inverters",
  "Solar Batteries",
  "Solar Lights",
  "Solar Chargers",
  "Solar Water Heaters",
  "Solar Fans",
  "Solar Garden Lights",
  ...(categoriesData || []).map((c) => c.title),
];

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("product");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [capacity, setCapacity] = useState("");
  const [warranty, setWarranty] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setImages([]);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !category || category === "Choose a category") {
      toast.error("Please fill out name, description, and category.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("type", type);
      formData.append("tags", tags);
      formData.append("originalPrice", originalPrice || discountPrice);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("capacity", capacity);
      formData.append("warranty", warranty);
      formData.append("vendorEmail", seller?.contactEmail || localStorage.getItem("vendorEmail") || "");
      formData.append("vendorName", seller?.companyName || localStorage.getItem("vendorCompany") || "");

      files.forEach((file) => {
        formData.append("productPictures", file);
      });

      await dispatch(createProduct(formData));
      dispatch(getAllProducts());
      toast.success("Product created successfully!");
      navigate("/dashboard-products");
    } catch (error) {
      toast.error(error.message || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[90%] 800px:w-[55%] bg-white shadow max-h-[82vh] rounded-[4px] p-6 overflow-y-scroll my-6">
      <h5 className="text-[28px] font-Poppins text-center mb-4">Create Product / Package</h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="pb-1 block font-medium">
            Listing Type <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border h-[38px] rounded-[5px] px-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="product">Solar Product</option>
            <option value="package">Solar Package</option>
          </select>
        </div>

        <div>
          <label className="pb-1 block font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>

        <div>
          <label className="pb-1 block font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows="4"
            value={description}
            className="block w-full pt-2 px-3 border border-gray-300 rounded-[3px] sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>

        <div>
          <label className="pb-1 block font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border h-[38px] rounded-[5px] px-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Choose a category</option>
            {Array.from(new Set(productCategories)).map((cat) => (
              <option value={cat} key={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {type === "package" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="pb-1 block font-medium">Capacity (e.g. 5 kW)</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
                placeholder="5 kW"
              />
            </div>
            <div>
              <label className="pb-1 block font-medium">Warranty (e.g. 10 years)</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
                placeholder="10 years"
              />
            </div>
          </div>
        )}

        <div>
          <label className="pb-1 block font-medium">Tags</label>
          <input
            type="text"
            value={tags}
            className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="solar, inverter, battery..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="pb-1 block font-medium">Original Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={originalPrice}
              className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="99.99"
            />
          </div>
          <div>
            <label className="pb-1 block font-medium">
              Discount Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={discountPrice}
              className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="79.99"
            />
          </div>
          <div>
            <label className="pb-1 block font-medium">
              Product Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={stock}
              className="block w-full px-3 h-[38px] border border-gray-300 rounded-[3px] sm:text-sm"
              onChange={(e) => setStock(e.target.value)}
              placeholder="15"
            />
          </div>
        </div>

        <div>
          <label className="pb-1 block font-medium">Upload Images</label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload" className="cursor-pointer flex items-center gap-2 text-sm text-gray-600">
              <AiOutlinePlusCircle size={30} color="#555" />
              <span>Select up to 5 images</span>
            </label>
            <div className="w-full flex flex-wrap mt-2">
              {images.map((img, idx) => (
                <img
                  src={img}
                  key={idx}
                  alt=""
                  className="h-[90px] w-[90px] object-cover m-1 rounded border"
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 cursor-pointer text-center text-white block w-full h-[40px] rounded-[4px] bg-[#051D40] hover:bg-[#0d336b] font-medium disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
