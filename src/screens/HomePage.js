import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import HeroSection from "../components/HeroSection";
import BestProduct from "../components/BestProduct";
import FeaturedProducts from "../components/Products/FeaturedProducts";
import StatsSection from "../components/StatsSection";
import ReviewSection from "../components/ReviewSection";
import Sponsored from "../components/Sponsored";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <Categories />
      <HeroSection />
      <BestProduct />
      <FeaturedProducts />
      <StatsSection />
      <ReviewSection />
      <Sponsored />
      <Footer />
    </div>
  );
};

export default HomePage;
