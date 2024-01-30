namespace Assessment.Data.dto
{
    public class ParamSearchEmployee
    {
        public int size { get; set; }
        public int page { get; set; }
        public string sortBy { get; set; }
        public string orderBy { get; set; }
        public string name { get; set; }
        public long id { get; set; }
    }
}
