using Assessment.Config;
using Assessment.Models;

namespace Assessment.Data.dto
{
    public class RespProductList:Result
    {
        public List<msproduct> data { get; set; }
    }
}

