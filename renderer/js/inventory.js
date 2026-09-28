/* =========================================
   MEDISTOCK INVENTORY JAVASCRIPT
========================================= */


/* =========================================
   GET HTML ELEMENTS
========================================= */

const inventoryForm =
    document.getElementById("inventoryForm");

const medicineNameInput =
    document.getElementById("medicineName");

const quantityInput =
    document.getElementById("quantity");

const saveBtn =
    document.getElementById("saveBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const message =
    document.getElementById("message");

const inventoryTableBody =
    document.getElementById("inventoryTableBody");

const emptyMessage =
    document.getElementById("emptyMessage");

const totalMedicines =
    document.getElementById("totalMedicines");

const totalQuantity =
    document.getElementById("totalQuantity");

const lowStock =
    document.getElementById("lowStock");

const formTitle =
    document.getElementById("formTitle");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================
   VARIABLES
========================================= */

let currentUser = null;

let editingId = null;


/* =========================================
   CHECK USER LOGIN
========================================= */

async function checkUser() {

    const {
        data,
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (
        error ||
        !data.user
    ) {

        window.location.href =
            "login.html";

        return false;
    }


    currentUser =
        data.user;

    return true;
}


/* =========================================
   LOAD INVENTORY
========================================= */

async function loadInventory() {

    if (!currentUser) {
        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("inventory")
            .select("*")
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Load inventory error:",
            error
        );

        message.textContent =
            error.message ||
            "Unable to load inventory.";

        message.style.color =
            "#dc2626";

        return;
    }


    console.log(
        "Inventory data:",
        data
    );


    /* =====================================
       STATISTICS
    ===================================== */

    totalMedicines.textContent =
        data.length;


    let quantityTotal = 0;

    let lowStockTotal = 0;


    data.forEach(
        item => {

            const quantity =
                Number(item.quantity) || 0;


            quantityTotal +=
                quantity;


            if (quantity < 10) {

                lowStockTotal++;

            }

        }
    );


    totalQuantity.textContent =
        quantityTotal;


    lowStock.textContent =
        lowStockTotal;


    /* =====================================
       CLEAR TABLE
    ===================================== */

    inventoryTableBody.innerHTML = "";


    /* =====================================
       EMPTY INVENTORY
    ===================================== */

    if (data.length === 0) {

        emptyMessage.style.display =
            "block";

        return;
    }


    emptyMessage.style.display =
        "none";


    /* =====================================
       DISPLAY MEDICINES
    ===================================== */

    data.forEach(
        item => {

            const row =
                document.createElement("tr");


            const quantity =
                Number(item.quantity) || 0;


            let statusText;

            let statusClass;


            /* STATUS */

            if (quantity === 0) {

                statusText =
                    "Out of Stock";

                statusClass =
                    "out";

            } else if (quantity < 10) {

                statusText =
                    "Low Stock";

                statusClass =
                    "low";

            } else {

                statusText =
                    "In Stock";

                statusClass =
                    "available";
            }


            /* TABLE ROW */

            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            item.medicine_name
                        )}
                    </strong>
                </td>

                <td>
                    ${quantity}
                </td>

                <td>

                    <span
                        class="status ${statusClass}"
                    >
                        ${statusText}
                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editMedicine(
                            '${item.id}',
                            '${escapeHTML(
                                item.medicine_name
                            )}',
                            ${quantity}
                        )"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteMedicine(
                            '${item.id}'
                        )"
                    >
                        🗑️ Delete
                    </button>

                </td>
            `;


            inventoryTableBody.appendChild(
                row
            );

        }
    );
}


/* =========================================
   ADD / UPDATE MEDICINE
========================================= */

inventoryForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const medicineName =
            medicineNameInput.value.trim();


        const quantity =
            Number(
                quantityInput.value
            );


        message.textContent = "";


        /* VALIDATE NAME */

        if (!medicineName) {

            message.textContent =
                "Please enter medicine name.";

            message.style.color =
                "#dc2626";

            return;
        }


        /* VALIDATE QUANTITY */

        if (
            quantity < 0 ||
            !Number.isInteger(quantity)
        ) {

            message.textContent =
                "Please enter a valid quantity.";

            message.style.color =
                "#dc2626";

            return;
        }


        /* CHECK LOGIN */

        if (!currentUser) {

            message.textContent =
                "User not logged in.";

            message.style.color =
                "#dc2626";

            return;
        }


        /* DISABLE BUTTON */

        saveBtn.disabled = true;


        if (editingId) {

            saveBtn.textContent =
                "Updating...";

        } else {

            saveBtn.textContent =
                "Adding...";
        }


        try {

            /* =================================
               UPDATE MEDICINE
            ================================= */

            if (editingId) {

                const {
                    error
                } =
                    await supabaseClient
                        .from("inventory")
                        .update({
                            medicine_name:
                                medicineName,

                            quantity:
                                quantity
                        })
                        .eq(
                            "id",
                            editingId
                        )
                        .eq(
                            "user_id",
                            currentUser.id
                        );


                if (error) {
                    throw error;
                }


                message.textContent =
                    "Medicine updated successfully!";


            }

            /* =================================
               ADD MEDICINE
            ================================= */

            else {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("inventory")
                        .insert([
                            {
                                user_id:
                                    currentUser.id,

                                medicine_name:
                                    medicineName,

                                quantity:
                                    quantity
                            }
                        ])
                        .select();


                if (error) {
                    throw error;
                }


                console.log(
                    "Medicine added:",
                    data
                );


                message.textContent =
                    "Medicine added successfully!";
            }


            message.style.color =
                "#15803d";


            /* RESET FORM */

            resetForm();


            /* RELOAD TABLE */

            await loadInventory();


        } catch (error) {

            console.error(
                "Save medicine error:",
                error
            );


            message.textContent =
                error.message ||
                "Unable to save medicine.";


            message.style.color =
                "#dc2626";
        }


        /* ENABLE BUTTON */

        saveBtn.disabled =
            false;


        saveBtn.textContent =
            editingId
                ? "Update Medicine"
                : "➕ Add Medicine";

    }
);


/* =========================================
   EDIT MEDICINE
========================================= */

function editMedicine(
    id,
    name,
    quantity
) {

    editingId =
        id;


    medicineNameInput.value =
        name;


    quantityInput.value =
        quantity;


    formTitle.textContent =
        "Update Medicine";


    saveBtn.textContent =
        "Update Medicine";


    cancelBtn.style.display =
        "inline-block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   DELETE MEDICINE
========================================= */

async function deleteMedicine(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this medicine?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("inventory")
                .delete()
                .eq(
                    "id",
                    id
                )
                .eq(
                    "user_id",
                    currentUser.id
                );


        if (error) {
            throw error;
        }


        message.textContent =
            "Medicine deleted successfully!";


        message.style.color =
            "#15803d";


        await loadInventory();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        message.textContent =
            error.message ||
            "Unable to delete medicine.";


        message.style.color =
            "#dc2626";
    }
}


/* =========================================
   CANCEL UPDATE
========================================= */

cancelBtn.addEventListener(
    "click",
    resetForm
);


/* =========================================
   RESET FORM
========================================= */

function resetForm() {

    editingId =
        null;


    inventoryForm.reset();


    formTitle.textContent =
        "Add Medicine";


    saveBtn.textContent =
        "➕ Add Medicine";


    cancelBtn.style.display =
        "none";
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await supabaseClient
                .auth
                .signOut();

            window.location.href =
                "index.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);


/* =========================================
   START INVENTORY PAGE
========================================= */

async function startInventory() {

    const loggedIn =
        await checkUser();


    if (!loggedIn) {
        return;
    }


    await loadInventory();
}


startInventory();