namespace Assessment.Data.dto
{
    public class RespInvoiceDetail
    {
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string InvoiceTo { get; set; }
        public string ShipTo { get; set; }
        public int SalesID { get; set; }
        public int CourierID { get; set; }
        public int PaymentType { get; set; }
        public decimal CourierFee { get; set; }
        public bool is_ok { get; set; }
        public List<RespInvDetail> dataDetail { get; set; }
    }

    public class RespInvDetail
    {
        public string InvoiceNo { get; set; }
        public string ProductID { get; set; }
        public string ProductName { get; set; }
        public float Weight { get; set; }
        public int Qty { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
    }
}
