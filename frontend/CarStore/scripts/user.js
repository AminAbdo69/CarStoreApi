const n = document.getElementById("name");

const name = sessionStorage.getItem("name");

n.innerText = name;

let dataa;

fetch(`https://localhost:7088/api/Admin/GetUser/${name}`) 
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); 
  })
  .then((user) => {
    dataa = user;
    
    console.log(user);
    console.log(user.username);
    console.log(user.cars);

    const tableBody = document.querySelector("#carTable tbody");

    
    dataa.cars.forEach((car) => {
      const row = tableBody.insertRow();
      const nameCell = row.insertCell(0);
      const detailsCell = row.insertCell(1);

      nameCell.textContent = car.name;
      detailsCell.textContent = car.model;
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
