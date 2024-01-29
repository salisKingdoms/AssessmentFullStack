using System.Net;

namespace Assessment.Models
{
    public class msemployee
    {
        public long ID { get; set; }
        public string name { get; set; }
        public DateTime birth_date { get; set; }
        public string? address { get; set; }
        public decimal? sallary { get; set; }
        public string nik { get; set; }
        public DateTime entry_date { get; set; }
        public DateTime update_date { get; set; }
 
    }
}
