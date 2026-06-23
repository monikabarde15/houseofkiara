import React from "react";

import featuredProductsData from "../../../data/home/featuredProductsData";

import SectionEyebrow from "../../shared/SectionEyebrow";
import SectionTitle from "../../shared/SectionTitle";
import ProductCard from "../../shared/ProductCard";
import ViewAllLink from "../../shared/ViewAllLink";
const DesktopFeatured = () => {
    return (
        <section className="desk-featured">
            <div className="desk-featured-header">
                <div className="desk-featured-header-left">
                    <SectionEyebrow
                        text={featuredProductsData.eyebrow}
                    />

                    <SectionTitle>
                        Featured <em>Pieces</em>
                    </SectionTitle>
                </div>

                <ViewAllLink 
                text="View All →"
                href="/main-page?section=designers"
                />
            </div>

            <div className="desk-featured-grid">
                {featuredProductsData.products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </section>
    );
};

export default DesktopFeatured;