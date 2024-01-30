namespace Assessment.Data.dto
{
    public class ParamSaveEmployee
    {
        public string name { get; set; }
        public DateTime birth_date { get; set; }
        public string? address { get; set; }
        public decimal? sallary { get; set; }
        public string nik { get; set; }
    }

    public class ParamUpdateEmployee
    {
        public long id { get; set; }
        public string name { get; set; }
        public DateTime birth_date { get; set; }
        public string? address { get; set; }
        public decimal? sallary { get; set; }
        public string nik { get; set; }
    }
}
