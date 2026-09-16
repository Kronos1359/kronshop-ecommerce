<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import {
    signIn,
    signUp,
    confirmSignUp
} from "aws-amplify/auth";

const emit = defineEmits(["login-success", "back"]);

const mode = ref("login");

const email = ref("");
const password = ref("");
const confirmationCode = ref("");

const message = ref("");
const loading = ref(false);

const showPassword = ref(false);

const passwordRules = computed(() => ({
    length: password.value.length >= 8,
    uppercase: /[A-Z]/.test(password.value),
    lowercase: /[a-z]/.test(password.value),
    number: /[0-9]/.test(password.value),
    special: /[^A-Za-z0-9]/.test(password.value)
}));

const passwordValid = computed(() => {
    return Object.values(passwordRules.value).every(Boolean);
});


// ========================
// Mouse interaction
// ========================

const mouseX = ref(0);
const mouseY = ref(0);

const handleMouseMove = (event) => {

    mouseX.value = event.clientX;
    mouseY.value = event.clientY;

};


// Soft glow follows cursor

const cursorGlowStyle = computed(() => ({
    left: `${mouseX.value}px`,
    top: `${mouseY.value}px`
}));


// Login card moves very slightly with cursor

const cardStyle = computed(() => {

    if (!mouseX.value && !mouseY.value) {
        return {};
    }

    const x =
        (mouseX.value / window.innerWidth - 0.5) * 16;

    const y =
        (mouseY.value / window.innerHeight - 0.5) * 16;

    return {
        transform: `translate(${x}px, ${y}px)`
    };

});


// ========================
// LOGIN
// ========================

const login = async () => {

    message.value = "";
    loading.value = true;

    try {

        await signIn({
            username: email.value,
            password: password.value
        });

        emit("login-success");

    } catch (error) {

        console.error(error);
        message.value = error.message;

    } finally {

        loading.value = false;

    }

};


// ========================
// SIGN UP
// ========================

const register = async () => {

    message.value = "";
    loading.value = true;

    try {

        await signUp({
            username: email.value,
            password: password.value,
            options: {
                userAttributes: {
                    email: email.value
                }
            }
        });

        message.value =
            "Account created! Check your email for the verification code.";

        mode.value = "confirm";

    } catch (error) {

        console.error(error);
        message.value = error.message;

    } finally {

        loading.value = false;

    }

};


// ========================
// CONFIRM ACCOUNT
// ========================

const confirmAccount = async () => {

    message.value = "";
    loading.value = true;

    try {

        await confirmSignUp({
            username: email.value,
            confirmationCode: confirmationCode.value
        });

        message.value =
            "Account confirmed! You can now log in.";

        mode.value = "login";

        confirmationCode.value = "";

    } catch (error) {

        console.error(error);
        message.value = error.message;

    } finally {

        loading.value = false;

    }

};


// ========================
// Mouse listener
// ========================

onMounted(() => {

    window.addEventListener(
        "mousemove",
        handleMouseMove
    );

});


onBeforeUnmount(() => {

    window.removeEventListener(
        "mousemove",
        handleMouseMove
    );

});

</script>


<template>

    <div class="auth-page">

        <!-- Cursor glow -->

        <div
            class="cursor-glow"
            :style="cursorGlowStyle"
        ></div>


        <!-- Background shapes -->

        <div class="background-shape shape-one"></div>
        <div class="background-shape shape-two"></div>
        <div class="background-shape shape-three"></div>


        <!-- Floating botanical elements -->

        <div class="petal petal-one">✿</div>
        <div class="petal petal-two">❀</div>
        <div class="petal petal-three">✦</div>
        <div class="petal petal-four">✿</div>
        <div class="petal petal-five">·</div>
        <div class="leaf leaf-one"></div>
        <div class="leaf leaf-two"></div>
        <div class="leaf leaf-three"></div>
        <div class="leaf leaf-four"></div>


        <!-- Header -->

        <header class="auth-header">

            <button
                class="brand"
                @click="emit('back')"
            >
                KronShop
            </button>

            <button
                class="back-button"
                @click="emit('back')"
            >
                Back to store
            </button>

        </header>


        <!-- Main -->

        <main class="auth-main">

            <section
                class="auth-card"
                :style="cardStyle"
            >

                <!-- ======================== -->
                <!-- LOGIN -->
                <!-- ======================== -->

                <div v-if="mode === 'login'">

                    <div class="flower-icon">
                        ✿
                    </div>

                    <p class="small-heading">
                        WELCOME BACK
                    </p>

                    <h1>
                        Sign in
                    </h1>

                    <p class="description">
                        Continue your KronShop journey.
                    </p>


                    <form @submit.prevent="login">

                        <label>
                            Email
                        </label>

                        <input
                            v-model="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />


                        <label>
                            Password
                        </label>

                        <div class="password-wrapper">

                            <input
                                v-model="password"
                                :type="
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                "
                                placeholder="Your password"
                                required
                            />

                            <button
                                type="button"
                                class="show-button"
                                @click="
                                    showPassword =
                                        !showPassword
                                "
                            >
                                {{
                                    showPassword
                                        ? "Hide"
                                        : "Show"
                                }}
                            </button>

                        </div>


                        <button
                            class="primary-button"
                            type="submit"
                            :disabled="loading || !passwordValid"
                        >

                            <span v-if="loading">
                                Signing in...
                            </span>

                            <span v-else>
                                Sign in
                            </span>

                        </button>

                    </form>


                    <div class="divider">
                        <span></span>
                        <p>or</p>
                        <span></span>
                    </div>


                    <p class="switch-text">

                        Don't have an account?

                        <button
                            class="link-button"
                            @click="
                                mode = 'signup';
                                message = '';
                            "
                        >
                            Create one
                        </button>

                    </p>

                </div>


                <!-- ======================== -->
                <!-- SIGN UP -->
                <!-- ======================== -->

                <div v-else-if="mode === 'signup'">

                    <div class="flower-icon">
                        ❀
                    </div>

                    <p class="small-heading">
                        JOIN KRONSHOP
                    </p>

                    <h1>
                        Create account
                    </h1>

                    <p class="description">
                        Your shopping journey starts here.
                    </p>


                    <form @submit.prevent="register">

                        <label>
                            Email
                        </label>

                        <input
                            v-model="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                        />


                        <label>
                            Password
                        </label>

                        <input
                            v-model="password"
                            type="password"
                            placeholder="Create a password"
                            required
                        />


                        <div class="password-rules">

                            <p class="rules-title">
                                Password must contain:
                            </p>

                            <div
                                class="password-rule"
                                :class="{ valid: passwordRules.length }"
                            >
                                <span class="rule-icon">
                                    {{ passwordRules.length ? "✓" : "○" }}
                                </span>

                                <span>
                                    At least 8 characters
                                </span>
                            </div>

                            <div
                                class="password-rule"
                                :class="{ valid: passwordRules.uppercase }"
                            >
                                <span class="rule-icon">
                                    {{ passwordRules.uppercase ? "✓" : "○" }}
                                </span>

                                <span>
                                    One uppercase letter
                                </span>
                            </div>

                            <div
                                class="password-rule"
                                :class="{ valid: passwordRules.lowercase }"
                            >
                                <span class="rule-icon">
                                    {{ passwordRules.lowercase ? "✓" : "○" }}
                                </span>

                                <span>
                                    One lowercase letter
                                </span>
                            </div>

                            <div
                                class="password-rule"
                                :class="{ valid: passwordRules.number }"
                            >
                                <span class="rule-icon">
                                    {{ passwordRules.number ? "✓" : "○" }}
                                </span>

                                <span>
                                    One number
                                </span>
                            </div>

                            <div
                                class="password-rule"
                                :class="{ valid: passwordRules.special }"
                            >
                                <span class="rule-icon">
                                    {{ passwordRules.special ? "✓" : "○" }}
                                </span>

                                <span>
                                    One special character
                                </span>
                            </div>

                        </div>


                        <button
                            class="primary-button"
                            type="submit"
                            :disabled="loading"
                        >

                            {{
                                loading
                                    ? "Creating..."
                                    : "Create account"
                            }}

                        </button>

                    </form>


                    <p class="switch-text">

                        Already have an account?

                        <button
                            class="link-button"
                            @click="
                                mode = 'login';
                                message = '';
                            "
                        >
                            Sign in
                        </button>

                    </p>

                </div>


                <!-- ======================== -->
                <!-- VERIFY -->
                <!-- ======================== -->

                <div v-else-if="mode === 'confirm'">

                    <div class="flower-icon">
                        ✦
                    </div>

                    <p class="small-heading">
                        ALMOST THERE
                    </p>

                    <h1>
                        Verify email
                    </h1>

                    <p class="description">
                        Enter the code we sent to
                        <strong>{{ email }}</strong>.
                    </p>


                    <form @submit.prevent="confirmAccount">

                        <label>
                            Verification code
                        </label>

                        <input
                            v-model="confirmationCode"
                            placeholder="Enter your code"
                            required
                        />


                        <button
                            class="primary-button"
                            type="submit"
                            :disabled="loading"
                        >

                            {{
                                loading
                                    ? "Verifying..."
                                    : "Verify email"
                            }}

                        </button>

                    </form>


                    <p class="switch-text">

                        Already verified?

                        <button
                            class="link-button"
                            @click="
                                mode = 'login';
                                message = '';
                            "
                        >
                            Sign in
                        </button>

                    </p>

                </div>


                <!-- MESSAGE -->

                <div
                    v-if="message"
                    class="message"
                >
                    {{ message }}
                </div>

            </section>

        </main>

    </div>

</template>


<style scoped>

/* ========================
   Base
======================== */

* {
    box-sizing: border-box;
}

.auth-page {
    width: 100%;
    height: 100vh;
    min-height: 100vh;
    min-height: 100dvh;

    position: relative;

    overflow: hidden;

    background:
        radial-gradient(
            circle at 10% 15%,
            rgba(169, 224, 190, 0.75),
            transparent 35%
        ),
        radial-gradient(
            circle at 90% 15%,
            rgba(239, 184, 216, 0.7),
            transparent 35%
        ),
        radial-gradient(
            circle at 15% 85%,
            rgba(193, 218, 198, 0.7),
            transparent 35%
        ),
        radial-gradient(
            circle at 90% 85%,
            rgba(205, 191, 232, 0.7),
            transparent 35%
        ),
        #f8f7f4;

    color: #26382f;

    font-family:
        Inter,
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
}

/* ========================
   Cursor glow
======================== */

.cursor-glow {
    position: fixed;

    width: 520px;
    height: 520px;

    border-radius: 50%;

    transform: translate(-50%, -50%);

    pointer-events: none;

    background:
        radial-gradient(
            circle,
            rgba(170, 222, 190, 0.30) 0%,
            rgba(222, 184, 214, 0.16) 30%,
            rgba(202, 192, 230, 0.08) 50%,
            transparent 72%
        );

    filter: blur(12px);

    z-index: 0;

    transition:
        left 0.08s ease-out,
        top 0.08s ease-out;
}


/* ========================
   Background shapes
======================== */

.background-shape {
    position: absolute;

    border-radius: 50%;

    pointer-events: none;

    filter: blur(1px);
}

.shape-one {
    width: 650px;
    height: 650px;

    left: -300px;
    top: 10%;

    background:
        rgba(151, 211, 171, 0.25);

    animation:
        drift-one 10s ease-in-out infinite;
}

.shape-two {
    width: 600px;
    height: 600px;

    right: -280px;
    top: -100px;

    background:
        rgba(232, 175, 209, 0.24);

    animation:
        drift-two 12s ease-in-out infinite;
}

.shape-three {
    width: 500px;
    height: 500px;

    bottom: -250px;
    left: 40%;

    background:
        rgba(190, 181, 225, 0.25);

    animation:
        drift-three 9s ease-in-out infinite;
}

/* ========================
   Floating decorations
======================== */

.petal {
    position: absolute;

    pointer-events: none;

    user-select: none;

    opacity: 0.55;

    z-index: 1;

    animation:
        floating 6s ease-in-out infinite;

    filter:
        drop-shadow(
            0 8px 18px
            rgba(80, 100, 85, 0.08)
        );
}

.petal-one {
    left: 7%;
    top: 17%;

    font-size: 4rem;

    color: #9b7290;
}

.petal-two {
    left: 23%;
    bottom: 13%;

    font-size: 3rem;

    color: #709a7c;

    animation-delay: -2s;
}

.petal-three {
    right: 10%;
    top: 20%;

    font-size: 3.2rem;

    color: #9386b2;

    animation-delay: -4s;
}

.petal-four {
    right: 23%;
    bottom: 14%;

    font-size: 4rem;

    color: #b27d99;

    animation-delay: -1s;
}

.petal-five {
    left: 4%;
    bottom: 40%;

    font-size: 5rem;

    color: #7fa58a;

    animation-delay: -3s;
}


.leaf {
    position: absolute;

    width: 90px;
    height: 45px;

    border-radius: 100% 0 100% 0;

    pointer-events: none;

    opacity: 0.35;

    filter: blur(0.2px);

    z-index: 1;

    animation:
        leaf-float 8s ease-in-out infinite;
}

.leaf-one {
    left: 2%;
    top: 48%;

    background: rgba(103, 153, 119, 0.55);

    transform: rotate(25deg);
}

.leaf-two {
    right: 2%;
    top: 48%;

    background: rgba(164, 112, 143, 0.45);

    transform: rotate(155deg);

    animation-delay: -3s;
}

.leaf-three {
    left: 35%;
    top: 8%;

    width: 60px;
    height: 30px;

    background: rgba(120, 165, 133, 0.4);

    transform: rotate(-25deg);

    animation-delay: -5s;
}

.leaf-four {
    right: 34%;
    bottom: 7%;

    width: 70px;
    height: 35px;

    background: rgba(174, 130, 164, 0.38);

    transform: rotate(200deg);

    animation-delay: -2s;
}


/* ========================
   Header
======================== */

.auth-header {
    position: relative;

    z-index: 5;

    width: 100%;

    height: 80px;

    padding:
        0 clamp(25px, 5vw, 80px);

    display: flex;

    align-items: center;

    justify-content: space-between;
}

.brand {
    border: none;

    background: transparent;

    padding: 0;

    font-family: Georgia, serif;

    font-size: 1.6rem;

    font-weight: 600;

    color: #315540;

    cursor: pointer;
}

.back-button {
    border: none;

    background: rgba(255, 255, 255, 0.4);

    padding: 10px 16px;

    border-radius: 100px;

    color: #53675b;

    cursor: pointer;

    transition:
        background 0.2s,
        transform 0.2s;
}

.back-button:hover {
    background: rgba(255, 255, 255, 0.75);

    transform: translateY(-1px);
}


/* ========================
   Main
======================== */

.auth-main {
    position: relative;

    z-index: 3;

    width: 100%;

    min-height:
        calc(100dvh - 80px);

    display: flex;

    align-items: center;

    justify-content: center;

    padding:
        30px 20px 60px;
}


/* ========================
   Card
======================== */

.auth-card {
    width: min(430px, 100%);

    padding: 45px;

    border-radius: 30px;

    background:
        rgba(255, 255, 255, 0.76);

    border:
        1px solid rgba(255, 255, 255, 0.9);

    box-shadow:
        0 30px 80px rgba(50, 72, 60, 0.13);

    backdrop-filter:
        blur(20px);

    -webkit-backdrop-filter:
        blur(20px);

    transition:
        transform 0.25s ease;

    position: relative;
}

.auth-card::before {
    content: "";

    position: absolute;

    inset: 0;

    border-radius: inherit;

    pointer-events: none;

    background:
        linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.45),
            transparent
        );
}


/* ========================
   Card content
======================== */

.flower-icon {
    font-size: 2rem;

    color: #a77995;

    margin-bottom: 15px;

    animation:
        gentle-float 4s ease-in-out infinite;
}

.small-heading {
    margin: 0;

    letter-spacing: 0.18em;

    font-size: 0.68rem;

    font-weight: 700;

    color: #6d8b78;
}

.auth-card h1 {
    margin:
        8px 0 10px;

    font-family: Georgia, serif;

    font-size: 2.6rem;

    font-weight: 500;

    color: #293d32;
}

.description {
    margin:
        0 0 30px;

    color: #768179;

    line-height: 1.5;

    font-size: 0.92rem;
}


/* ========================
   Form
======================== */

form {
    position: relative;

    z-index: 2;

    display: flex;

    flex-direction: column;
}

label {
    margin-bottom: 8px;

    color: #43584a;

    font-size: 0.82rem;

    font-weight: 600;
}

input {
    width: 100%;

    padding:
        14px 15px;

    margin-bottom: 20px;

    border:
        1px solid #d9e0db;

    border-radius: 12px;

    background:
        rgba(252, 253, 252, 0.8);

    color: #26382f;

    outline: none;

    font-size: 0.94rem;

    transition:
        border-color 0.2s,
        box-shadow 0.2s,
        background 0.2s;
}

input::placeholder {
    color: #a0aaa4;
}

input:focus {
    background: white;

    border-color: #8eb59b;

    box-shadow:
        0 0 0 4px
        rgba(142, 181, 155, 0.13);
}


/* ========================
   Password
======================== */

.password-wrapper {
    position: relative;
}

.password-wrapper input {
    padding-right: 65px;
}

.show-button {
    position: absolute;

    right: 12px;
    top: 11px;

    border: none;

    background: transparent;

    color: #6b8c77;

    font-size: 0.78rem;

    cursor: pointer;
}


/* ========================
   Primary button
======================== */

.primary-button {
    width: 100%;

    margin-top: 4px;

    padding: 14px;

    border: none;

    border-radius: 13px;

    background:
        linear-gradient(
            135deg,
            #50765f,
            #42634f
        );

    color: white;

    font-size: 0.92rem;

    font-weight: 600;

    cursor: pointer;

    box-shadow:
        0 10px 25px
        rgba(70, 103, 82, 0.16);

    transition:
        transform 0.2s,
        box-shadow 0.2s,
        filter 0.2s;
}

.primary-button:hover:not(:disabled) {
    transform:
        translateY(-2px);

    box-shadow:
        0 14px 30px
        rgba(70, 103, 82, 0.22);

    filter:
        brightness(1.04);
}

.primary-button:active:not(:disabled) {
    transform:
        translateY(0);
}

.primary-button:disabled {
    opacity: 0.6;

    cursor: not-allowed;
}


/* ========================
   Divider
======================== */

.divider {
    display: flex;

    align-items: center;

    gap: 12px;

    margin: 25px 0 20px;
}

.divider span {
    height: 1px;

    flex: 1;

    background: #e0e5e1;
}

.divider p {
    margin: 0;

    color: #a0aaa4;

    font-size: 0.75rem;
}


/* ========================
   Switch
======================== */

.switch-text {
    margin: 0;

    text-align: center;

    color: #7c8580;

    font-size: 0.85rem;
}

.link-button {
    border: none;

    background: transparent;

    padding: 0;

    color: #9b6b88;

    font-weight: 600;

    cursor: pointer;
}

.link-button:hover {
    text-decoration: underline;
}


/* ========================
   Password rules
======================== */

.password-rules {
    margin:
        -8px 0 20px;

    padding:
        13px 15px;

    border-radius: 13px;

    background:
        rgba(242, 247, 243, 0.7);

    border:
        1px solid rgba(180, 201, 187, 0.45);
}

.rules-title {
    margin:
        0 0 9px;

    color: #52685a;

    font-size: 0.76rem;

    font-weight: 700;
}

.password-rule {
    display: flex;

    align-items: center;

    gap: 8px;

    margin:
        5px 0;

    color: #9a9f9b;

    font-size: 0.75rem;

    transition:
        color 0.2s ease,
        transform 0.2s ease;
}

.password-rule.valid {
    color: #52765f;

    transform:
        translateX(2px);
}

.rule-icon {
    display: flex;

    align-items: center;
    justify-content: center;

    width: 17px;
    height: 17px;

    flex-shrink: 0;

    border-radius: 50%;

    border:
        1px solid #cbd3cd;

    color: #a0a6a1;

    font-size: 0.65rem;

    font-weight: 700;

    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        color 0.2s ease;
}

.password-rule.valid .rule-icon {
    background: #dceadf;

    border-color: #a8c3ae;

    color: #4f775d;
}


/* ========================
   Message
======================== */

.message {
    margin-top: 20px;

    padding:
        12px 14px;

    border-radius: 11px;

    background:
        rgba(224, 239, 228, 0.75);

    color: #526a5b;

    font-size: 0.8rem;

    line-height: 1.45;
}


/* ========================
   Animations
======================== */

@keyframes floating {

    0%,
    100% {
        transform:
            translateY(0)
            rotate(0deg);
    }

    50% {
        transform:
            translateY(-14px)
            rotate(8deg);
    }
}

@keyframes gentle-float {

    0%,
    100% {
        transform:
            translateY(0);
    }

    50% {
        transform:
            translateY(-5px);
    }
}

@keyframes drift-one {

    0%,
    100% {
        transform:
            translate(0, 0);
    }

    50% {
        transform:
            translate(30px, -20px);
    }
}

@keyframes drift-two {

    0%,
    100% {
        transform:
            translate(0, 0);
    }

    50% {
        transform:
            translate(-25px, 25px);
    }
}

@keyframes drift-three {

    0%,
    100% {
        transform:
            translate(0, 0);
    }

    50% {
        transform:
            translate(20px, -25px);
    }
}


@keyframes leaf-float {

    0%,
    100% {
        translate: 0 0;
    }

    50% {
        translate: 10px -15px;
    }
}


/* ========================
   Mobile
======================== */

@media (max-width: 600px) {

    .auth-header {
        height: 70px;

        padding:
            0 20px;
    }

    .brand {
        font-size: 1.35rem;
    }

    .back-button {
        padding:
            8px 12px;

        font-size: 0.75rem;
    }

    .auth-main {
        min-height:
            calc(100dvh - 70px);

        padding:
            20px 16px 40px;
    }

    .auth-card {
        padding:
            32px 24px;

        border-radius: 24px;
    }

    .auth-card h1 {
        font-size: 2.2rem;
    }

    .petal-one {
        left: 5%;
    }

    .petal-four {
        right: 5%;
    }

}


/* Disable the cursor-heavy effects on touch devices */

@media (hover: none) {

    .cursor-glow {
        display: none;
    }

}

</style>