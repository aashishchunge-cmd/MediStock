const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    message.textContent = "Checking login...";

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        message.textContent = error.message;
        return;
    }

    // Check admin permission

    const { data: admin, error: adminError } =
        await supabaseClient
            .from("admin_users")
            .select("user_id")
            .eq("user_id", data.user.id)
            .maybeSingle();

    if (adminError || !admin) {

        await supabaseClient.auth.signOut();

        message.textContent = "Access denied. Admin only.";

        return;
    }

    message.textContent = "Admin login successful!";

    window.location.href = "dashboard.html";

});