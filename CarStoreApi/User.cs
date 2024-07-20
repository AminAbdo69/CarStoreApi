namespace CarStoreApi
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }

        public List<Car> cars { get; set; }
    }
}
