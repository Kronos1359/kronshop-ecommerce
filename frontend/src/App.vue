<script setup>
import { ref, onMounted } from "vue";

import {
    getCurrentUser,
    signOut
} from "aws-amplify/auth";

import Login from "./Login.vue";

const user = ref(null);
const showLogin = ref(false);

const products = ref([]);
const loadingProducts = ref(true);
const error = ref("");


// ========================
// Check login + load products
// ========================

onMounted(async () => {

    // Check existing login
    try {
        user.value = await getCurrentUser();
    } catch {
        user.value = null;
    }

    // Load products
    try {
        const response = await fetch(
            "http://localhost:4000/products"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        products.value = await response.json();

    } catch (err) {

        console.error(err);

        error.value = "Could not load products.";

    } finally {

        loadingProducts.value = false;

    }
});


// ========================
// Logout
// ========================

const logout = async () => {

    try {

        await signOut();

        user.value = null;

    } catch (error) {

        console.error(error);

    }

};


// ========================
// Login successful
// ========================

const handleLoginSuccess = async () => {

    user.value = await getCurrentUser();

    showLogin.value = false;

};


// ========================
// Format price
// ========================

const formatPrice = (price) => {

    return new Intl.NumberFormat("en-IN").format(price);

};

</script>


<template>

    <!-- ========================
         LOGIN PAGE
    ========================= -->

    <Login
        v-if="showLogin && !user"
        @login-success="handleLoginSuccess"
        @back="showLogin = false"
    />


    <!-- ========================
         HOME PAGE
    ========================= -->

    <main v-else class="home-page">


        <!-- ========================
             NAVBAR
        ========================= -->

        <header class="navbar">

            <div class="brand">

                <span class="brand-flower">
                    ✿
                </span>

                <span>
                    KronShop
                </span>

            </div>


            <nav class="nav-links">

                <a href="#products">
                    Products
                </a>

                <a href="#categories">
                    Categories
                </a>

            </nav>


            <div class="account-area">

                <!-- Logged out -->

                <button
                    v-if="!user"
                    class="login-button"
                    @click="showLogin = true"
                >
                    Login
                </button>


                <!-- Logged in -->

                <div
                    v-else
                    class="user-area"
                >

                    <span class="username">
                        {{ user.username }}
                    </span>

                    <button
                        class="logout-button"
                        @click="logout"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </header>



        <!-- ========================
             HERO
        ========================= -->

        <section class="hero-section">

            <div class="hero-decoration decoration-one">
                ✿
            </div>

            <div class="hero-decoration decoration-two">
                ❀
            </div>

            <div class="hero-decoration decoration-three">
                ✧
            </div>


            <div class="hero-content">

                <p class="eyebrow">
                    A way to shop
                </p>

                <h1>
                    Find something
                    <span>you'll love.</span>
                </h1>

                <p class="hero-description">
                    Discover products worth bringing home,
                    all in one place.
                </p>


                <a
                    href="#products"
                    class="shop-button"
                >
                    Explore products
                    <span>→</span>
                </a>

            </div>


            <div class="hero-orb orb-one"></div>
            <div class="hero-orb orb-two"></div>

        </section>



        <!-- ========================
             CATEGORIES
        ========================= -->

        <section
            id="categories"
            class="categories-section"
        >

            <div class="section-heading">

                <p class="section-label">
                    Browse
                </p>

                <h2>
                    Explore categories
                </h2>

            </div>


            <div class="category-list">

                <button class="category-pill active">
                    All products
                </button>

                <button class="category-pill">
                    Electronics
                </button>

                <button class="category-pill">
                    Accessories
                </button>

                <button class="category-pill">
                    Home
                </button>

            </div>

        </section>



        <!-- ========================
             PRODUCTS
        ========================= -->

        <section
            id="products"
            class="products-section"
        >

            <div class="section-heading">

                <div>

                    <p class="section-label">
                        Our collection
                    </p>

                    <h2>
                        Featured products
                    </h2>

                </div>

                <span class="product-count">
                    {{ products.length }} products
                </span>

            </div>


            <!-- Loading -->

            <div
                v-if="loadingProducts"
                class="status-message"
            >

                <div class="loading-flower">
                    ✿
                </div>

                <p>
                    Finding your products...
                </p>

            </div>


            <!-- Error -->

            <div
                v-else-if="error"
                class="status-message error-message"
            >

                <p>
                    {{ error }}
                </p>

            </div>


            <!-- Products -->

            <div
                v-else
                class="product-grid"
            >

                <article
                    v-for="(product, index) in products"
                    :key="product.id"
                    class="product-card"
                    :class="`card-${index % 3}`"
                >

                    <div class="product-image">

                        <span class="product-flower">
                            {{ index % 2 === 0 ? "✿" : "❀" }}
                        </span>

                        <span class="product-number">
                            0{{ index + 1 }}
                        </span>

                    </div>


                    <div class="product-info">

                        <div>

                            <h3>
                                {{ product.name }}
                            </h3>

                            <p class="stock">
                                {{ product.stock }} in stock
                            </p>

                        </div>


                        <p class="price">
                            ₹{{ formatPrice(product.price) }}
                        </p>

                    </div>


                    <button class="view-product">
                        View product
                        <span>→</span>
                    </button>

                </article>

            </div>

        </section>



        <!-- ========================
             FOOTER
        ========================= -->

        <footer class="footer">

            <div class="footer-brand">

                <span>
                    ✿
                </span>

                KronShop

            </div>

            <p>
                Made for discovering things you'll love.
            </p>

        </footer>

    </main>

</template>