
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, clave })
  });

  if (res.ok) {
    localStorage.setItem("adminAutenticado", "true");
    window.location.href = "admin.html";
  } else {
    alert("Credenciales incorrectas");
  }
});
