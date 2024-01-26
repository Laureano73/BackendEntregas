const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async (e) => {
    const result = await fetch("http://localhost:8080/api/session/logout", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const { redirect } = await result.json();
    window.location.href = redirect;
});

const botones_delete = document.querySelectorAll(".btn_delete");

botones_delete.forEach((boton) => {
    boton.addEventListener("click", () => {
        const productoId = boton.getAttribute("data-producto-id");
        socket.emit("deleteProduct", productoId);
    });
});

function createProduct() {
    const newProductName = document.getElementById("newProductName").value;
    const newProductPrice = document.getElementById("newProductPrice").value;
    const newProductCategory =
        document.getElementById("newProductCategory").value;

    const newProduct = {
        title: newProductName,
        descripcion: "",
        code: "",
        status: true,
        stock: 0,
        price: newProductPrice,
        thumbnails: [],
        category: newProductCategory,
    };

    socket.emit("addProduct", newProduct);

    document.getElementById("productForm").reset();
}