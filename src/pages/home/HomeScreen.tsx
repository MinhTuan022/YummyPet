import { Button } from "antd";
import { _router } from "../../context/routerSingleton";
import { _global } from "../../global";
import "./HomeScreen.scss"
import { useRef, useState, useEffect } from "react";
import Carousel, { CarouselRef } from "antd/es/carousel";
import images from "../../res/images";
import { EyeOutlined, ShoppingCartOutlined, HeartOutlined, StarOutlined, CheckCircleOutlined } from '@ant-design/icons';

const HomeScreen = () => {

  const carouselRef = useRef<CarouselRef>(null);
  const productCarouselRef = useRef<CarouselRef>(null);

  const handleNext = () => carouselRef.current?.next();
  const handlePrev = () => carouselRef.current?.prev();

  const slides = [
    {
      id: 1,
      title: "Where Being A Pet Is Just The Best",
      tagline: "BIG STOCK FOR PET",
      img: images.thumbnail,
    },
    {
      id: 2,
      title: "60% Sale, We Make Shopping Easy",
      tagline: "SPECIAL OFFERS TODAY",
      img: images.dog,
    },
  ];

  const categories = [
    { id: 1, name: "Dog Food", img: images.dogfood },
    { id: 2, name: "Cat Food", img: images.catfood },
    { id: 3, name: "Rabbit Food", img: images.rabbitfood },
    { id: 4, name: "Bird Food", img: images.birdfood },
    { id: 5, name: "Hamster Food", img: images.hamsterfood },
  ];

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const products = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    name: "PetPleasant Products Dog Food",
    image: images.product1,
    originalPrice: 550.00,
    discountedPrice: 500.00,
    discountPercentage: "-7%",
  }));

  const miniPromoCards = [
    {
      id: 'p1',
      subtitle: 'HIGH QUALITY SOURCED',
      title: 'Almo Nature Chicken Food',
      image: images.promoCard1,
      className: 'card-pink',
    },
    {
      id: 'p2',
      subtitle: 'UP TO 25% DISCOUNT',
      title: 'Slow Feeder Steel Pets Bowl',
      image: images.promoCard2,
      className: 'card-yellow',
    },
    {
      id: 'p3',
      subtitle: 'PET TOYS COLLECTION',
      title: 'Spacewalk Dog Harness',
      image: images.promoCard3,
      className: 'card-green',
    }
  ];

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="homescreen-wrapper">
      <div className="hero-carousel-wrapper">
        <Carousel autoplay ref={carouselRef} dots={true}>
          {slides.map((slide) => (
            <div key={slide.id} className="hero">
              <div className="image-content">
                <img src={slide.img} alt="Dog" className="dog" />
                <div className="text-content">
                  <div className="tagline">{slide.tagline}</div>
                  <h1>{slide.title}</h1>
                  <Button className="shop-now" type="primary" size="large">
                    SHOP NOW
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="carousel-controls">
          <Button shape="circle" onClick={handlePrev}>
            ←
          </Button>
          <Button shape="circle" onClick={handleNext}>
            →
          </Button>
        </div>
      </div>

      <section className="shop-by-categories-section">
        <div className="category-header">
          <img src={images.icon} alt="Logo" className="icon" />
          <h2>Shop By Categories</h2>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-image-wrapper">
                <img src={category.img} alt={category.name} className="category-img" />
              </div>
              <p className="category-name">{category.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="promotional-banners-section">
        <div className="main-promo-card large-promo-card blue-bg">
          <div className="promo-text-content">
            <p className="promo-subtitle">NATURE'S BLEND FOODS</p>
            <h3>Natural Freeze<br />Dog Foods</h3>
            <Button className="shop-now-promo" type="primary" size="large">
              Shop Now
            </Button>
          </div>
          <div className="promo-image-content">
            <img src={images.banner1} alt="Natural Freeze Dog Foods" className="promo-img" />
          </div>
        </div>

        <div className="side-promo-cards">
          <div className="small-promo-card pink-bg top-right-card">
            <div className="promo-text-content">
              <p className="promo-code">CODE: PETZY001</p>
              <h4>Banded Pet<br />Accessories</h4>
            </div>
            <div className="promo-image-content">
              <img src={images.banner2} alt="Banded Pet Accessories" className="promo-img small-promo-img" />
            </div>
          </div>

          <div className="small-promo-card light-blue-bg bottom-right-card">
            <div className="promo-text-content">
              <p className="promo-subtitle">SUMMER SALE OFFER</p>
              <h4>Best Quality Pet<br />Foods</h4>
            </div>
            <div className="promo-image-content">
              <img src={images.banner3} alt="Best Quality Pet Foods" className="promo-img small-promo-img" />
            </div>
          </div>
        </div>

        <div className="main-promo-card large-promo-card light-pink-bg right-promo-card">
          <div className="promo-text-content">
            <p className="promo-subtitle">BIG OFFER ALL FOODS</p>
            <h3>Deal Up To 25%<br />Discounts</h3>
            <Button className="shop-now-promo" type="primary" size="large">
              Shop Now
            </Button>
          </div>
          <div className="promo-image-content">
            <img src={images.banner4} alt="Deal Up To 25% Discounts" className="promo-img" />
          </div>
        </div>
      </section>

      <section className="healthy-food-section">
        <div className="healthy-food-image-content">
          <div className="background-shape"></div>
          <img src={images.beagleFood} alt="Beagle with dog food" className="main-img" />
        </div>
        <div className="healthy-food-text-content">
          <div className="promo-subtitle">
            <p>100% ORGANIC PET FOOD</p>
          </div>
          <h2>Help Your Dog Maintain A Healthier</h2>
          <p className="description">
            Introducing Petzy's delectable range of pet food, crafted with love and care. With Petzy,
            mealtime becomes a delightful experience, fostering the bond between you and your pet
            while providing essential nourishment.
          </p>
          <div className="features-grid">
            <div className="feature-item">
              <StarOutlined /> <span>24/7 Support</span>
            </div>
            <div className="feature-item">
              <StarOutlined /> <span>Personalized care</span>
            </div>
            <div className="feature-item">
              <StarOutlined /> <span>Pet Taxi Facility</span>
            </div>
            <div className="feature-item">
              <StarOutlined /> <span>Quick Delivery</span>
            </div>
            <div className="feature-item">
              <StarOutlined /> <span>Money Back</span>
            </div>
            <div className="feature-item">
              <StarOutlined /> <span>Lowest Price</span>
            </div>
          </div>
          <Button className="shop-now" type="primary" size="large">
            SHOP NOW
          </Button>
        </div>
      </section>

      <section className="limited-offer-section">
        <div className="container">
          <div className="offer-content-wrapper">
            <div className="offer-left-content">
              <div className="promo-subtitle">
                <p>FRESH FLAVOURED FOOD</p>
              </div>
              <h2 className="offer-title">Up To <span>25% Off</span><br />Discounts</h2>
              <ul className="offer-features">
                <li><CheckCircleOutlined /> Cat Food</li>
                <li><CheckCircleOutlined /> Dog Food</li>
                <li><CheckCircleOutlined /> Rodents Food</li>
              </ul>
            </div>

            <div className="offer-image-content">
              <img src={images.catFoodOffer} alt="Cat food on offer" />
            </div>

            <div className="offer-right-content">
              <p className="hurry-text">Hurry up limited-time offer</p>
              <div className="countdown-timer">
                <div className="timer-block">
                  <div className="time">{timeLeft.days}</div>
                  <div className="label">DAY</div>
                </div>
                <div className="timer-block">
                  <div className="time">{timeLeft.hours}</div>
                  <div className="label">HOUR</div>
                </div>
                <div className="timer-block">
                  <div className="time">{timeLeft.minutes}</div>
                  <div className="label">MIN</div>
                </div>
                <div className="timer-block">
                  <div className="time">{timeLeft.seconds}</div>
                  <div className="label">SEC</div>
                </div>
              </div>
              <Button className="shop-now" type="primary" size="large">
                SHOP NOW
              </Button>
            </div>
          </div>
        </div>
        <div className="wavy-border">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
            <path d="M1440,56.8C1200,56.8,960,0,720,0S240,56.8,0,56.8V100H1440V56.8Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      <section className="product-display-section">
        <div className="section-header">
          <div className="header-title">
            <img src={images.icon} alt="Logo" className="icon" />
            <h2>Best Training, Nutritional Food<br />And Healthy Pets</h2>
          </div>
        </div>

        <Carousel
          ref={productCarouselRef}
          rows={2}
          slidesToShow={4}
          slidesToScroll={4}
          draggable={true}
          infinite={false}
          dots={false}
          responsive={[
            {
              breakpoint: 1200,
              settings: { slidesToShow: 3, slidesToScroll: 3 },
            },
            {
              breakpoint: 768,
              settings: { slidesToShow: 2, slidesToScroll: 2 },
            },
            {
              breakpoint: 576,
              settings: { slidesToShow: 1, slidesToScroll: 1 },
            },
          ]}
        >
          {products.map((product) => (
            <div key={product.id} className="product-slide-item">
              <div className="product-card">
                <div className="image-wrapper">
                  <img src={product.image} alt={product.name} className="product-img" />
                  {product.discountPercentage && (
                    <span className="badge discount-badge">{product.discountPercentage}</span>
                  )}
                  <div className="product-actions">
                    <Button shape="circle" icon={<EyeOutlined />} />
                    <Button shape="circle" icon={<ShoppingCartOutlined />} />
                    <Button shape="circle" icon={<HeartOutlined />} />
                    <Button shape="circle" icon={<StarOutlined />} />
                  </div>
                </div>
                <div className="product-info">
                  <p className="product-name">{product.name}</p>
                  <div className="product-price">
                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                    <span className="current-price">${product.discountedPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      <section className="mini-promos-section">
        <div className="mini-promos-grid">
          {miniPromoCards.map((card) => (
            <div key={card.id} className={`mini-promo-card ${card.className}`}>
              <div className="mini-promo-text">
                <p className="mini-promo-subtitle">{card.subtitle}</p>
                <h3 className="mini-promo-title">{card.title}</h3>
              </div>
              <img src={card.image} alt={card.title} className="mini-promo-image" />
            </div>
          ))}
        </div>
      </section>

      <section className="healthy-food-section">
        <div className="healthy-food-image-content">
          <div className="background-shape"></div>
          <img src={images.beagleFood2} alt="Beagle with dog food" className="main-img" />
        </div>
        <div className="healthy-food-text-content">
          <div className="promo-subtitle">
            <p>FRESH FLAVOURED FOOD</p>
          </div>
          <h2>Edgard Cooper Diet Every Eater</h2>
          <p className="description">
            Introducing Petzy's delectable range of pet food, crafted with love and care. With Petzy, mealtime becomes a delightful experience.
          </p>
          <Button className="shop-now" type="primary" size="large">
            SHOP NOW
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;