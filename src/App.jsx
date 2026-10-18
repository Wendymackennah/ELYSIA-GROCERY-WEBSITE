import { useMemo, useState } from 'react';

import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

import {
  Add,
  ArrowForward,
  Favorite,
  FavoriteBorder,
  LocalShippingOutlined,
  Menu,
  Remove,
  Search,
  ShoppingBagOutlined,
  SpaOutlined,
  Close,
  DeleteOutline,
} from '@mui/icons-material';

import products from './data/products.js';

const categories = [
  'All Products',
  'Fresh Produce',
  'Dairy & Eggs',
  'Bakery',
  'Drinks',
];

const money = (amount) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount);

function SectionTitle({ eyebrow, title, description }) {
  return (
    <Box className="section-heading">
      <Typography className="eyebrow">{eyebrow}</Typography>

      <Typography variant="h2" className="section-title">
        {title}
      </Typography>

      {description && (
        <Typography className="section-description">
          {description}
        </Typography>
      )}
    </Box>
  );
}

function ProductCard({
  product,
  onAdd,
  isFavourite,
  onToggleFavourite,
}) {
  return (
    <Box className="product-card">
      <Box className="product-image-wrap">
        <Box
          component="img"
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        {product.badge && (
          <Typography className="product-badge">
            {product.badge}
          </Typography>
        )}

        <IconButton
          aria-label={
            isFavourite
              ? `Remove ${product.name} from favourites`
              : `Add ${product.name} to favourites`
          }
          className="favourite-button"
          onClick={() => onToggleFavourite(product.id)}
        >
          {isFavourite ? (
            <Favorite color="error" />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      </Box>

      <Box className="product-details">
        <Typography className="product-category">
          {product.category}
        </Typography>

        <Typography className="product-name">
          {product.name}
        </Typography>

        <Typography className="product-unit">
          {product.unit}
        </Typography>

        <Box className="product-bottom">
          <Typography className="product-price">
            {money(product.price)}
          </Typography>

          <IconButton
            aria-label={`Add ${product.name} to cart`}
            className="add-button"
            onClick={() => onAdd(product)}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  const [activeCategory, setActiveCategory] =
    useState('All Products');

  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState([]);

  const [favourites, setFavourites] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [email, setEmail] = useState('');

  const [newsletterMessage, setNewsletterMessage] =
    useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === 'All Products' ||
        product.category === activeCategory;

      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  function addToCart(product) {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        { ...product, quantity: 1 },
      ];
    });
  }

  function changeQuantity(productId, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + amount,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  function toggleFavourite(productId) {
    setFavourites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  }

  function handleNewsletterSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setNewsletterMessage('Please enter your email address.');
      return;
    }

    setNewsletterMessage(
      'Thank you for joining the Elysia community!'
    );

    setEmail('');
  }

  function scrollToProducts() {
    document.getElementById('products')?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <Box className="site">
      <Box className="announcement-bar">
        Fresh finds, thoughtfully delivered.
        <span> Enjoy shopping with Elysia Grocery.</span>
      </Box>

      <AppBar position="sticky" elevation={0} className="navbar">
        <Container maxWidth="xl">
          <Toolbar disableGutters className="nav-toolbar">
            <IconButton
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu />
            </IconButton>

            <a className="brand" href="#home">
              <SpaOutlined className="brand-icon" />

              <Box>
                <Typography className="brand-name">
                  elysia
                </Typography>

                <Typography className="brand-subtitle">
                  GROCERY & MARKET
                </Typography>
              </Box>
            </a>

            <Box className="desktop-nav">
              <a href="#home">Home</a>
              <a href="#products">Shop</a>
              <a href="#our-story">Our Story</a>
              <a href="#newsletter">Contact</a>
            </Box>

            <Box className="nav-actions">
              <TextField
                size="small"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                onFocus={() => {
                  document
                    .getElementById('products')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="nav-search"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <IconButton
                aria-label="Open shopping cart"
                className="cart-icon-button"
                onClick={() => setCartOpen(true)}
              >
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingBagOutlined />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box className="mobile-drawer">
          <IconButton
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <Close />
          </IconButton>

          <a href="#home" onClick={() => setMobileMenuOpen(false)}>
            Home
          </a>
          <a href="#products" onClick={() => setMobileMenuOpen(false)}>
            Shop
          </a>
          <a href="#our-story" onClick={() => setMobileMenuOpen(false)}>
            Our Story
          </a>
          <a href="#newsletter" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </a>
        </Box>
      </Drawer>

      <main>
        <section id="home" className="hero-section">
          <Container maxWidth="xl">
            <Box className="hero-grid">
              <Box className="hero-copy">
                <Box className="hero-label">
                  <SpaOutlined fontSize="small" />
                  A FRESHER WAY TO LIVE
                </Box>

                <Typography variant="h1" className="hero-title">
                  Good food.
                  <br />
                  <span>Beautifully</span>
                  <br />
                  everyday.
                </Typography>

                <Typography className="hero-description">
                  Discover thoughtfully selected produce,
                  everyday essentials, and little luxuries
                  that make your table feel like home.
                </Typography>

                <Box className="hero-buttons">
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={scrollToProducts}
                  >
                    Shop fresh groceries
                  </Button>

                  <Button
                    variant="text"
                    href="#our-story"
                    className="story-link"
                  >
                    Discover Elysia
                  </Button>
                </Box>

                <Box className="hero-note">
                  <Box className="hero-note-line" />
                  <Typography>
                    Your everyday market, made special.
                  </Typography>
                </Box>
              </Box>

              <Box className="hero-visual">
                <Box className="hero-image-frame">
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop&q=85"
                    alt="Fresh vegetables and produce at a market"
                    className="hero-image"
                  />
                </Box>

                <Box className="hero-floating-card">
                  <SpaOutlined />
                  <Box>
                    <Typography className="floating-title">
                      Freshness first
                    </Typography>
                    <Typography className="floating-caption">
                      Better choices, every day
                    </Typography>
                  </Box>
                </Box>

                <Box className="hero-decoration">e.</Box>
              </Box>
            </Box>
          </Container>
        </section>

        <section className="benefits-section">
          <Container maxWidth="xl">
            <Box className="benefits-grid">
              <Box className="benefit-item">
                <Box className="benefit-icon">
                  <SpaOutlined />
                </Box>
                <Box>
                  <Typography className="benefit-title">
                    Thoughtfully selected
                  </Typography>
                  <Typography className="benefit-text">
                    Good things for your table
                  </Typography>
                </Box>
              </Box>

              <Box className="benefit-item">
                <Box className="benefit-icon">
                  <LocalShippingOutlined />
                </Box>
                <Box>
                  <Typography className="benefit-title">
                    Convenient shopping
                  </Typography>
                  <Typography className="benefit-text">
                    Your essentials in one place
                  </Typography>
                </Box>
              </Box>

              <Box className="benefit-item">
                <Box className="benefit-icon">
                  <FavoriteBorder />
                </Box>
                <Box>
                  <Typography className="benefit-title">
                    Made with care
                  </Typography>
                  <Typography className="benefit-text">
                    A little more joy in everyday life
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </section>

        <section id="products" className="products-section">
          <Container maxWidth="xl">
            <SectionTitle
              eyebrow="THE ELYSIA EDIT"
              title="Your everyday favourites"
              description="Fresh essentials and lovely little finds, chosen for your home."
            />

            <Box className="category-row">
              {categories.map((category) => (
                <Button
                  key={category}
                  className={`category-button ${
                    activeCategory === category ? 'active' : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </Box>

            <Box className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  isFavourite={favourites.includes(product.id)}
                  onToggleFavourite={toggleFavourite}
                />
              ))}
            </Box>

            {filteredProducts.length === 0 && (
              <Box className="empty-results">
                <Search />
                <Typography variant="h6">
                  No groceries found
                </Typography>
                <Typography>
                  Try another search or choose a different category.
                </Typography>

                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All Products');
                  }}
                >
                  View all products
                </Button>
              </Box>
            )}

            <Box className="products-bottom">
              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                onClick={() => {
                  setActiveCategory('All Products');
                  setSearchQuery('');
                }}
              >
                Explore all groceries
              </Button>
            </Box>
          </Container>
        </section>

        <section id="our-story" className="story-section">
          <Container maxWidth="xl">
            <Box className="story-grid">
              <Box className="story-image-wrap">
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&auto=format&fit=crop&q=85"
                  alt="A beautifully prepared table of fresh food"
                  className="story-image"
                  loading="lazy"
                />
              </Box>

              <Box className="story-copy">
                <Typography className="eyebrow">
                  A LITTLE ABOUT US
                </Typography>

                <Typography variant="h2" className="story-title">
                  A more thoughtful
                  <br />
                  kind of grocery.
                </Typography>

                <Typography className="story-description">
                  We believe everyday shopping can feel a
                  little more special. Elysia brings together
                  fresh produce and everyday essentials in
                  one welcoming place, so making good choices
                  for your home feels simple.
                </Typography>

                <Typography className="story-description">
                  From your morning fruit to the ingredients
                  for a slow Sunday meal, we want the little
                  things to feel lovely.
                </Typography>

                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={scrollToProducts}
                >
                  Shop the collection
                </Button>
              </Box>
            </Box>
          </Container>
        </section>

        <section id="newsletter" className="newsletter-section">
          <Container maxWidth="md">
            <Box className="newsletter-content">
              <SpaOutlined className="newsletter-icon" />

              <Typography className="eyebrow">
                NOTES FROM ELYSIA
              </Typography>

              <Typography variant="h2" className="newsletter-title">
                A little goodness in your inbox.
              </Typography>

              <Typography className="newsletter-description">
                Fresh finds, seasonal inspiration, and
                thoughtful ideas for your home.
              </Typography>

              <Box
                component="form"
                className="newsletter-form"
                onSubmit={handleNewsletterSubmit}
              >
                <TextField
                  fullWidth
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  slotProps={{
                    htmlInput: {
                      'aria-label': 'Your email address',
                    },
                  }}
                />

                <Button type="submit" variant="contained">
                  Join us
                </Button>
              </Box>

              {newsletterMessage && (
                <Typography
                  role="status"
                  className="newsletter-message"
                >
                  {newsletterMessage}
                </Typography>
              )}

              <Typography className="newsletter-fine-print">
                A little inspiration, never too much.
              </Typography>
            </Box>
          </Container>
        </section>
      </main>

      <footer className="footer">
        <Container maxWidth="xl">
          <Box className="footer-top">
            <a className="brand footer-brand" href="#home">
              <SpaOutlined className="brand-icon" />
              <Box>
                <Typography className="brand-name">
                  elysia
                </Typography>
                <Typography className="brand-subtitle">
                  GROCERY & MARKET
                </Typography>
              </Box>
            </a>

            <Typography className="footer-tagline">
              Good food. Thoughtfully chosen.
            </Typography>

            <Box className="footer-links">
              <a href="#products">Shop</a>
              <a href="#our-story">Our story</a>
              <a href="#newsletter">Contact</a>
            </Box>
          </Box>

          <Box className="footer-bottom">
            <Typography>
              © {new Date().getFullYear()} Elysia Grocery.
              All rights reserved.
            </Typography>

            <Typography>
              Made for the everyday moments.
            </Typography>
          </Box>
        </Container>
      </footer>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      >
        <Box className="cart-drawer">
          <Box className="cart-header">
            <Box>
              <Typography variant="h5" className="cart-title">
                Your basket
              </Typography>
              <Typography className="cart-subtitle">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </Typography>
            </Box>

            <IconButton
              onClick={() => setCartOpen(false)}
              aria-label="Close basket"
            >
              <Close />
            </IconButton>
          </Box>

          {cart.length === 0 ? (
            <Box className="empty-cart">
              <ShoppingBagOutlined />
              <Typography variant="h6">
                Your basket is waiting
              </Typography>
              <Typography>
                Add a few lovely things for your home.
              </Typography>

              <Button
                variant="contained"
                onClick={() => setCartOpen(false)}
              >
                Continue shopping
              </Button>
            </Box>
          ) : (
            <>
              <Box className="cart-items">
                {cart.map((item) => (
                  <Box key={item.id} className="cart-item">
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.name}
                      className="cart-item-image"
                    />

                    <Box className="cart-item-details">
                      <Typography className="cart-item-name">
                        {item.name}
                      </Typography>

                      <Typography className="cart-item-unit">
                        {item.unit}
                      </Typography>

                      <Typography className="cart-item-price">
                        {money(item.price * item.quantity)}
                      </Typography>

                      <Box className="quantity-control">
                        <IconButton
                          size="small"
                          aria-label={`Reduce ${item.name} quantity`}
                          onClick={() => changeQuantity(item.id, -1)}
                        >
                          <Remove fontSize="small" />
                        </IconButton>

                        <Typography>{item.quantity}</Typography>

                        <IconButton
                          size="small"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => changeQuantity(item.id, 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <IconButton
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box className="cart-summary">
                <Box className="cart-total-row">
                  <Typography>Subtotal</Typography>
                  <Typography className="cart-total">
                    {money(cartTotal)}
                  </Typography>
                </Box>

                <Typography className="cart-shipping-note">
                  Delivery fees, if applicable, are not included.
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    alert(
                      'Your basket is ready! Online checkout will be added in a future version.'
                    );
                  }}
                >
                  Continue to checkout
                </Button>

                <Button
                  fullWidth
                  onClick={() => setCartOpen(false)}
                >
                  Continue shopping
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}

export default App;