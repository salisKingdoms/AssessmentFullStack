using Assessment.Models;

namespace Assessment.Data.Repository
{
    public interface IInvoiceRepo
    {
        public List<msproduct> GetProductList();
        public List<mscourier> GetCourierList();
        public List<mspayment> GetPaymentList();
        public List<mssales> GetSales();
        public List<trinvoice> GetLastInvoices();
    }
}
