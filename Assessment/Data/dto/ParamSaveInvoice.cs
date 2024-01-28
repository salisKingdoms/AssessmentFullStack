using Assessment.Models;

namespace Assessment.Data.dto
{
    public class ParamSaveInvoice
    {
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string InvoiceTo { get; set; }
        public string ShipTo { get; set; }
        public int SalesID { get; set; }
        public int CourierID { get; set; }
        public int PaymentType { get; set; }
        public decimal CourierFee { get; set; }
        public List<ParamInvDetail> dataDetail { get; set; }
    }

    public class RespSaveInvoice
    {
        public string messageUI { get; set; }
        public string messageConsole { get; set; }
        public bool is_ok { get; set; }
    }

    public class ParamInvDetail
    {
        public string InvoiceNo { get; set; }
        public string ProductID { get; set; }
        public int WeightID { get; set; }
        public int Weight { get; set; }
        public int Qty { get; set; }
        public decimal Price { get; set; }

    }
}
