const loginForm = document.getElementById("loginForm");

const loginBtn = document.getElementById("loginBtn");

const message = document.getElementById("message");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


/* SHOW / HIDE PASSWORD */

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";

        togglePassword.textContent = "Show";
    }

});


/* LOGIN */

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const password =
        passwordInput.value.trim();


    message.textContent = "";

    message.style.color = "#dc2626";


    if (!email || !password) {

        message.textContent =
            "Please enter email and password.";

        return;
    }


    loginBtn.disabled = true;

    loginBtn.textContent = "Signing In...";


    try {

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            message.textContent =
                error.message;

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Sign In →";

            return;
        }


        if (!data.user) {

            message.textContent =
                "Login failed. Please try again.";

            loginBtn.disabled = false;

            loginBtn.textContent =
                "Sign In →";

            return;
        }


        message.style.color = "#15803d";

        message.textContent =
            "Login successful! Opening dashboard...";


        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 700);


    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong. Please try again.";

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Sign In →";
    }

});