using CarStoreApi.DTO;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Xml.Linq;

namespace CarStoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {

        [HttpPost("Login")]
        public ActionResult<UserLoginDTO> Login([FromBody] string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return BadRequest("Invalid UserName");
            }

            User user = GetUser(username);
            if (user == null)
            {
                return NotFound("User Not Found");
            }

            // Set the role based on the user
            string role = user.UserName == "adminuser" ? "Admin" : "User";

            // Set the cookies
            Response.Cookies.Append("Username", username, new CookieOptions
            {
                Secure = true,
                HttpOnly = false,
                SameSite = SameSiteMode.None,
            });

            Response.Cookies.Append("Role", role, new CookieOptions
            {
                Secure = true,
                HttpOnly = false,
                SameSite = SameSiteMode.None,
            });
            UserLoginDTO user2 = new UserLoginDTO()
            {
                name = username,
                role = role
            };

            return Ok(user2);



        }

        [HttpGet("GetAllUsers")]
        public ActionResult<List<User>> GetAllUsers2()
        {
            string json = System.IO.File.ReadAllText("Json/users.json");
            List<User> items = JsonConvert.DeserializeObject<List<User>>(json)!;
            return Ok(items);
        }
        private List<User> GetAllUsers()
        {
            string json = System.IO.File.ReadAllText("Json/users.json");
            List<User> items = JsonConvert.DeserializeObject<List<User>>(json)!;
            return items;
        }

        [HttpGet("GetUser/{Username}")]
        public ActionResult<User> GetUser2(string Username)
        {
            if (Username == null || Username == "")
            {
                return BadRequest("Invalid Username");
            }
            User? User = GetUser(Username);
            if (User == null)
            {
                return NotFound("User not found.");
            }
            UserDTO user = new UserDTO()
            {
                username = Username,
                cars = User.cars
            };

            return Ok(user);
        }

        private User? GetUser(string Username)
        {
            if (Username == null || Username == "")
            {
                return null;
            }
            User? User = GetAllUsers().FirstOrDefault(u => u.UserName == Username);
            return User;
        }

        [HttpPost("AddUser")]
        public ActionResult<string> AddUser([FromBody] string name)
        {
            //if (!IsAdmin())
            //{
            //    return Unauthorized("Unauthorized Access");
            //}
            if(name == null || name == "")
            {
                return BadRequest("User Can't Be Empty.");
            }
            if(GetUser(name) == null)
            {
                int userid = GetAllUsers().Count;
                User u = new User();
                u.Id = userid;
                u.UserName = name;
                u.cars = [];

                string json = System.IO.File.ReadAllText("Json/users.json");
                List<User> users = JsonConvert.DeserializeObject<List<User>>(json);
                users.Add(u);
                string updatedJson = JsonConvert.SerializeObject(users, Formatting.Indented);
                System.IO.File.WriteAllText("Json/users.json", updatedJson);

                return Ok($"{u.UserName} Has Been Added Successfully");
            }
            return Conflict($"{name} Already Exist");
        }

        [HttpGet("GetAllCars")]
        private ActionResult<List<Car>> GetAllCars2()
        {

            string json = System.IO.File.ReadAllText("Json/cars.json");
            List<Car> items = JsonConvert.DeserializeObject<List<Car>>(json)!;
            return Ok(items);
        }

        private List<Car> GetAllCars()
        {

            string json = System.IO.File.ReadAllText("Json/cars.json");
            List<Car> items = JsonConvert.DeserializeObject<List<Car>>(json)!;
            return items;
        }

        [HttpGet("GetCarById/{id}")]

        public ActionResult<Car>? GetCar2(int id)
        {
            if (id == null || id < 0)
            {
                return null;
            }
            Car? car = GetAllCars().Find(u => u.Id == id);
            return Ok(car);
        }
        private Car? GetCar(int id)
        {
            if (id == null || id < 0)
            {
                return null;
            }
            Car? car = GetAllCars().Find(u => u.Id == id);
            return car;
        }

        [HttpGet("GetCarByName/{name}")]
        private Car? GetCarByName(string Username)
        {
            if (Username == null || Username == "")
            {
                return null;
            }
            Car? car = GetAllCars().FirstOrDefault(u => u.Name == Username);
            return car;
        }


        [HttpPost("AddCar")]
        public ActionResult<string> AddCar(AddCarDTO car)
        {
            if (car.name == null || car.name == "")
            {
                return BadRequest("Name Can't Be Empty.");
            }
            if (car.model == null || car.model > DateTime.Now.Year)
            {
                return BadRequest("Invalid Car model.");
            }

            int carid = GetAllCars().Count;
            Car c = new Car();
            c.Id = carid;
            c.Name = car.name;
            c.Model = car.model;

            if (GetCarByName(car.name) == null)
            {
                string json = System.IO.File.ReadAllText("Json/cars.json");
                List<Car> cars = JsonConvert.DeserializeObject<List<Car>>(json);
                cars.Add(c);
                string updatedJson = JsonConvert.SerializeObject(cars, Formatting.Indented);
                System.IO.File.WriteAllText("Json/cars.json", updatedJson);
                return Ok($" {c.Name} Has Been Added Successfully");
            }
            return Conflict($"{car.name} Already Exist");

        }

        [HttpPut("recommend")]
        public ActionResult<string> Recommed(recommendDTO rdto)
        {
            if (rdto.carid == null || rdto.carid < 0)
            {
                return null;
            }
            string json = System.IO.File.ReadAllText("Json/users.json");
            List<User> userList = JsonConvert.DeserializeObject<List<User>>(json)!;
            User user = userList.FirstOrDefault(u => u.UserName == rdto.username);
            Car car = GetAllCars().Find(c => c.Id == rdto.carid);
            if (user != null)
            {
                foreach( Car c in user.cars) {
                    if(c.Id == rdto.carid)
                    {
                        return Conflict($"Car Already Recommended To {user.UserName}");
                    }
                }
                user.cars.Add(car);
                string updatedJson = JsonConvert.SerializeObject(userList, Formatting.Indented);
                System.IO.File.WriteAllText("Json/users.json", updatedJson);
                return Ok($" {car.Name} Has Been Added Successfully to {user.UserName}");
                
            }

            return NotFound($"Not Found This User");
        }

        private bool IsAdmin()
        {
            var username = Request.Cookies["Username"];
            var role = Request.Cookies["Role"];

            return username == "adminuser" && role == "Admin";
        }

    }  
}
