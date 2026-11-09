const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Checking account...";

    try {

        // Step 1: Authenticate user

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            message.textContent = error.message;
            return;
        }

        // Step 2: Check admin permission

        const { data: admin, error: adminError } =
            await supabaseClient
                .from("admin_users")
                .select("user_id")
                .eq("user_id", data.user.id)
                .maybeSingle();

        if (adminError) {

            console.error("Admin check error:", adminError);

            message.textContent =
                "Database error: " + adminError.message;

            await supabaseClient.auth.signOut();

            return;
        }

        // Step 3: Reject non-admin users

        if (!admin) {

            await supabaseClient.auth.signOut();

            message.textContent =
                "Your account is not registered as an admin.";

            return;
        }

        // Step 4: Successful login

        message.textContent = "Login successful!";

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error(error);

        message.textContent = error.message;

    }

});