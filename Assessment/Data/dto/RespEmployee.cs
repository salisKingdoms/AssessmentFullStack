using Assessment.Models;

namespace Assessment.Data.dto
{
    public class RespEmployee
    {
        public bool is_ok { get; set; }
        public long ID { get; set; }
        public string name { get; set; }
        public DateTime birth_date { get; set; }
        public string? address { get; set; }
        public decimal? sallary { get; set; }
        public string nik { get; set; }
        public DateTime entry_date { get; set; }
        public DateTime update_date { get; set; }
        public string message { get; set; }
    }

    public class RespEmployeeList
    {
        public bool is_ok { get; set; }
        public string message { get; set; }
        public List<ParamRespEmployeeList> data { get; set; }
        public int totalRow { get; set; }
    }

    public class ParamGridSearch
    {
        public string orderBy { get; set; }
        public string sortBy { get; set; }
        public int page { get; set; }
        public int size { get; set; }
        public string search { get; set; }
    }

    public class ParamRespEmployeeList
    {
        public long ID { get; set; }
        public string name { get; set; }
        public DateTime birth_date { get; set; }
        public string? address { get; set; }
        public decimal? sallary { get; set; }
        public string nik { get; set; }
        public DateTime entry_date { get; set; }
        public DateTime update_date { get; set; }
        public int RowNum { get; set; }
        public int totalRecord { get; set; }
    }
}
