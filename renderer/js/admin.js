async function requireAdmin() {

    try {

        const {
            data: { user },
            error
        } = await supabaseClient.auth.getUser();

        if (error || !user) {

            window.location.href = "login.html";

            return null;
        }

        const {
            data: admin,
            error: adminError
        } = await supabaseClient
            .from("admin_users")
            .select("user_id")
            .eq("user_id", user.id)
            .maybeSingle();

        if (adminError) {

            console.error(
                "Admin verification error:",
                adminError
            );

            alert(
                "Could not verify admin permission: " +
                adminError.message
            );

            return null;
        }

        if (!admin) {

            await supabaseClient.auth.signOut();

            alert("Access denied. Admin only.");

            window.location.href = "login.html";

            return null;
        }

        console.log("Admin verified:", user.email);

        return user;

    } catch (error) {

        console.error("Verification failed:", error);

        alert("Something went wrong. Check the console.");

        return null;
    }
}