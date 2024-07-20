const joinForm = document.getElementById("form");
const eee = document.getElementById("Errors");

joinForm.addEventListener("submit", HandleSubmit);

async function HandleSubmit(e) {
  e.preventDefault();

  try {
    const name = joinForm.Username.value;

    if (!name) {
      eee.innerText = "Please Enter Any Name.";
      return;
    }
    const response = await fetch("https://localhost:7088/api/Admin/Login", {
      method: "POST",
      body: JSON.stringify(name),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.role == "Admin") {
        sessionStorage.setItem("name", data.name);
        location.href = "/admin.html";
      } else if (data.role == "User") {
        sessionStorage.setItem("name", data.name);
        location.href = "/user.html";
      }
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // try {
  //   const name = joinForm.Username.value;

  //   if (!name) {
  //     eee.innerText = "Please Enter Any Name.";
  //     return;
  //   }

  //   const response = await fetch("https://localhost:7088/api/Admin/Login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(name),
  //   });

  //   const message = await response.json();

  //   console.log(message);
  //   // location.href = "/admin.html";
  // } catch (e) {
  //   console.log(e);
  // }
}
