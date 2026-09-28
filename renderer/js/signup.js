const signupForm =
    document.getElementById("signupForm");

const signupBtn =
    document.getElementById("signupBtn");

const message =
    document.getElementById("message");

const passwordInput =
    document.getElementById("password");

const confirmPassword =
    document.getElementById("confirmPassword");

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


/* SIGN UP */

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document
            .getElementById("email")
            .value
            .trim();

    const password =
        passwordInput.value.trim();

    const confirm =
        confirmPassword.value.trim();


    message.textContent = "";

    message.style.color = "#dc2626";


    /* CHECK EMAIL */

    if (!email) {

        message.textContent =
            "Please enter your email.";

        return;
    }


    /* CHECK PASSWORD */

    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    /* CHECK PASSWORD MATCH */

    if (password !== confirm) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    signupBtn.disabled = true;

    signupBtn.textContent =
        "Creating Account...";


    try {

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password

            });


        if (error) {

            console.error(error);

            message.textContent =
                error.message;

            signupBtn.disabled = false;

            signupBtn.textContent =
                "Create Account →";

            return;
        }


        console.log(
            "Account created:",
            data
        );


        message.style.color = "#15803d";

        message.textContent =
            "Account created successfully!";


        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1500);


    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong. Please try again.";

        signupBtn.disabled = false;

        signupBtn.textContent =
            "Create Account →";
    }

});