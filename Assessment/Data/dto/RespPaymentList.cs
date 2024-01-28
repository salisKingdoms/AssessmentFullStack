using Assessment.Config;
using Assessment.Models;

namespace Assessment.Data.dto
{
    public class RespPaymentList:Result
    {
        public List<mspayment> data { get; set; }
    }
}
