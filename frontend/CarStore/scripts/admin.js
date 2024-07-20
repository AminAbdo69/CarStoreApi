const myform1 = document.getElementById("form1");
const myform2 = document.getElementById("form2");
const myform3 = document.getElementById("form3");
const eee = document.getElementById("Errors");
const output = document.getElementById("output");

// document.getElementById("showForm1").addEventListener("change", function () {
//   myform1.style.display = this.checked ? "block" : "none";
//   if (this.checked) {
//     myform2.style.display = "none";
//     myform3.style.display = "none";
//   }
// });

// document.getElementById("showForm2").addEventListener("change", function () {
//   myform2.style.display = this.checked ? "block" : "none";
//   if (this.checked) {
//     myform1.style.display = "none";
//     myform3.style.display = "none";
//   }
// });

// document.getElementById("showForm3").addEventListener("change", function () {
//   myform3.style.display = this.checked ? "block" : "none";
//   if (this.checked) {
//     myform1.style.display = "none";
//     myform2.style.display = "none";
//   }
// });

const forms = document.querySelectorAll("form");

function toggleForms(formToShow) {
  forms.forEach((form) => {
    form.style.display = form === formToShow ? "block" : "none";
  });
}

document.getElementById("showForm1").addEventListener("change", () => {
  toggleForms(document.getElementById("form1"));
});

document.getElementById("showForm2").addEventListener("change", () => {
  toggleForms(document.getElementById("form2"));
});

document.getElementById("showForm3").addEventListener("change", () => {
  toggleForms(document.getElementById("form3"));
});

myform1.addEventListener("submit", HandleSubmit);

async function HandleSubmit(e) {
  e.preventDefault();

  try {
    const name = myform1.Username.value;

    if (!name) {
      eee.innerText = "Please Enter Any Name.";
      return;
    }
    const response = await fetch("https://localhost:7088/api/Admin/AddUser", {
      method: "POST",
      body: JSON.stringify(name), // Replace with the actual user input
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.text(); // Get the response as text
      output.innerText = data;
      myform1.Username.value = ""; // Use the response data (e.g., "Admin" or "user")
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// async function HandleSubmit(e) {
//   e.preventDefault();

//   try {
//     const name = myform1.Username.value;

//     if (!name) {
//       eee.innerText = "Please Enter Any Name.";
//       return;
//     }
//     const response = await fetch("https://localhost:7088/api/Admin/AddUser", {
//       method: "POST",
//       body: JSON.stringify(name), // Replace with the actual user input
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (response.ok) {
//       const data = await response.text(); // Get the response as text
//       output.innerText = data;
//       myform1.Username.value = ""; // Use the response data (e.g., "Admin" or "user")
//     } else {
//       console.error("Error:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }

//   // try {
//   //   const name = joinForm.Username.value;

//   //   if (!name) {
//   //     eee.innerText = "Please Enter Any Name.";
//   //     return;
//   //   }

//   //   const response = await fetch("https://localhost:7088/api/Admin/Login", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //     body: JSON.stringify(name),
//   //   });

//   //   const message = await response.json();

//   //   console.log(message);
//   //   // location.href = "/admin.html";
//   // } catch (e) {
//   //   console.log(e);
//   // }
// }

document
  .getElementById("form2")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    var name = document.getElementById("name2").value;
    var model = parseInt(document.getElementById("model").value);

    try {
      const response = await fetch("https://localhost:7088/api/Admin/AddCar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, model }),
      });

      if (response.ok) {
        const result = await response.text();
        document.getElementById("output").textContent = result;
      } else {
        document.getElementById("Error").textContent = "Error adding car.";
      }
    } catch (error) {
      console.error("An error occurred:", error);
      document.getElementById("Error").textContent = "An error occurred.";
    }
  });

document
  .getElementById("form3")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    var carid = parseInt(document.getElementById("carid3").value);
    var username = document.getElementById("name3").value;

    try {
      const response = await fetch(
        "https://localhost:7088/api/Admin/recommend",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ carid, username }),
        }
      );

      if (response.ok) {
        const result = await response.text();
        document.getElementById("output").textContent = result;
      } else {
        document.getElementById("Error").textContent =
          "Error recommending car.";
      }
    } catch (error) {
      console.error("An error occurred:", error);
      document.getElementById("Error").textContent = "An error occurred.";
    }
  });
