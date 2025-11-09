document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, clave })
    });

    if (res.ok) {
      const resultado = await res.json();
      if (resultado.acceso === true) {
        localStorage.setItem("adminAutenticado", "true");
        window.location.href = "admin.html";
      } else {
        alert("Credenciales incorrectas");
      }
    } else {
      alert("Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error al intentar iniciar sesión:", error);
    alert("Error de conexión con el servidor");
  }
});

