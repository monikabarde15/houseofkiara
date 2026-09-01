import Categories from "../../components/Home/Categories/Categories";
import Commitment from "../../components/Home/Commitment/Commitment";
import FeaturedDesigners from "../../components/Home/Designers/FeaturedDesigners";
import Featured from "../../components/Home/Featured/Featured";
import HokHero from "../../components/Home/Hero/HokHero";
import HowItWorks from "../../components/Home/HowItWorks/HowItWorks";
import InstagramSection from "../../components/Home/Instagram/Instagram";
import Testimonials from "../../components/Home/Testimonials/Testimonials";

const HomePage = () => {
  return (
    <>
      <HokHero />
      <HowItWorks/>
      <Featured />
      <Categories/>
      <Commitment/>
      <FeaturedDesigners/>
      <Testimonials/>
      <InstagramSection/>
    </>
  );
};

export default HomePage;