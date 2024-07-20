namespace CarStoreApi.DTO
{
    public class UserDTO
    {
        public required string username {  get; set; }
        public required List<Car> cars { get; set; }
    }
}
