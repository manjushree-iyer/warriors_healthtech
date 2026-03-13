import Layout from "../components/Layout";
import Hero from "../components/Hero";
import StatsRow from "../components/StatsRow";
import BookingBar from "../components/BookingBar";
import Departments from "../components/Departments";
import ECGDivider from "../components/ECGDivider";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";

const Home = () => {
  return (
    <Layout>
      <div className="flex flex-col relative">
        <Hero />
        <StatsRow />
        <BookingBar />
        <Departments />
        <ECGDivider />
        <Services />
        <WhyChooseUs />
      </div>
    </Layout>
  );
};

export default Home;
