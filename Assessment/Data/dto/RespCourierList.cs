using Assessment.Config;
using Assessment.Models;

namespace Assessment.Data.dto
{
    public class RespCourierList:Result
    {
        public List<mscourier> data { get; set; }
    }
}
