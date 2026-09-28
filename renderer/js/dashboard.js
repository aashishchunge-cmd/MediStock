const userEmail =
    document.getElementById("userEmail");

const totalMedicines =
    document.getElementById("totalMedicines");

const totalQuantity =
    document.getElementById("totalQuantity");

const lowStock =
    document.getElementById("lowStock");

const recentInventory =
    document.getElementById("recentInventory");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================
   LOAD DASHBOARD
========================================= */

async function loadDashboard() {

    /* GET LOGGED-IN USER */

    const {
        data: userData,
        error: userError
    } = await supabaseClient.auth.getUser();


    if (
        userError ||
        !userData.user
    ) {

        window.location.href =
            "login.html";

        return;
    }


    const user =
        userData.user;


    /* SHOW EMAIL */

    if (userEmail) {

        userEmail.textContent =
            user.email;

    }


    /* GET INVENTORY */

    const {
        data,
        error
    } = await supabaseClient

        .from("inventory")

        .select("*")

        .eq(
            "user_id",
            user.id
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Dashboard inventory error:",
            error
        );


        if (recentInventory) {

            recentInventory.innerHTML = `

                <p class="error-message">
                    ${error.message}
                </p>

            `;

        }

        return;
    }


    console.log(
        "Dashboard inventory:",
        data
    );


    /* =================================
       TOTAL MEDICINES
    ================================= */

    if (totalMedicines) {

        totalMedicines.textContent =
            data.length;

    }


    /* =================================
       TOTAL QUANTITY
    ================================= */

    let total =
        0;


    data.forEach(item => {

        total +=
            Number(item.quantity) || 0;

    });


    if (totalQuantity) {

        totalQuantity.textContent =
            total;

    }


    /* =================================
       LOW STOCK
    ================================= */

    const lowStockItems =
        data.filter(item => {

            return (
                Number(item.quantity) < 10
            );

        });


    if (lowStock) {

        lowStock.textContent =
            lowStockItems.length;

    }


    /* =================================
       RECENT INVENTORY
    ================================= */

    if (!recentInventory) {
        return;
    }


    recentInventory.innerHTML =
        "";


    if (data.length === 0) {

        recentInventory.innerHTML = `

            <div class="empty-dashboard">

                <div>
                    💊
                </div>

                <h3>
                    No Medicines Added
                </h3>

                <p>
                    Add your first medicine
                    from the Inventory page.
                </p>

            </div>

        `;

        return;
    }


    /* SHOW LATEST 5 */

    data
        .slice(0, 5)
        .forEach(item => {


            const quantity =
                Number(item.quantity) || 0;


            let status =
                "In Stock";


            let statusClass =
                "available";


            if (quantity === 0) {

                status =
                    "Out of Stock";

                statusClass =
                    "out";

            } else if (quantity < 10) {

                status =
                    "Low Stock";

                statusClass =
                    "low";

            }


            const itemDiv =
                document.createElement("div");


            itemDiv.className =
                "recent-item";


            itemDiv.innerHTML = `

                <div class="medicine-info">

                    <div class="medicine-icon">
                        💊
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                item.medicine_name
                            )}
                        </strong>

                        <span>
                            Quantity:
                            ${quantity}
                        </span>

                    </div>

                </div>


                <span class="status ${statusClass}">
                    ${status}
                </span>

            `;


            recentInventory.appendChild(
                itemDiv
            );

        });

}


/* =========================================
   HTML SECURITY
========================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


/* =========================================
   LOGOUT
========================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            await supabaseClient
                .auth
                .signOut();

            window.location.href =
                "index.html";

        }
    );

}


/* =========================================
   START
========================================= */

loadDashboard();