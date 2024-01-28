using Assessment.Config;
using Assessment.Models;

namespace Assessment.Data.dto
{
    public class RespSalesList:Result
    {
        public List<mssales> data { get; set; }
    }
}
