async function requireAdmin() {

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

    if (adminError || !admin) {

        await supabaseClient.auth.signOut();

        alert("Access denied. Admin only.");

        window.location.href = "login.html";

        return null;
    }

    return user;
}