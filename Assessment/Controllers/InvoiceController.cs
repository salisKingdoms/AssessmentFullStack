using Assessment.Data.DataAccess;
using Assessment.Data.dto;
using Assessment.Data.Repository;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Assessment.Controllers
{
    public class InvoiceController : Controller
    {
        private readonly InvoiceRepo _invRepo;

        public InvoiceController(InvoiceRepo repo)
        {
            _invRepo = repo;
        }
        public IActionResult InvoiceDetail()
        {
            return View();
        }

        [HttpGet]
        public string GetSalesList()
        {
            RespSalesList result = new RespSalesList();
            try
            {
                var sales = _invRepo.GetSales();
                result.data = sales;
                result.is_ok = true;
            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.data = null;
            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpGet]
        public string GetPaymentList()
        {
            RespPaymentList result = new RespPaymentList();
            try
            {
                var payment = _invRepo.GetPaymentList();
                result.data = payment;
                result.is_ok = true;
            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.data = null;
            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpGet]
        public string GetCourierList()
        {
            RespCourierList result = new RespCourierList();
            try
            {
                var courier = _invRepo.GetCourierList();
                result.data = courier;
                result.is_ok = true;
            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.data = null;
            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpGet]
        public string GetProductList()
        {
            RespProductList result = new RespProductList();
            try
            {
                var product = _invRepo.GetProductList();
                result.data = product;
                result.is_ok = true;
            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.data = null;
            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpPost]
        public JsonResult SubmitInvoice(ParamSaveInvoice model)
        {
            RespSaveInvoice result = new RespSaveInvoice();
            try
            {
                if (!string.IsNullOrEmpty(model.InvoiceNo))
                {
                    //update
                    var update = _invRepo.EditInvoice(model);
                    result.is_ok = true;
                    return Json(result);
                }

                //save invoice
                //generate inv row number sementara
                var lastInv = _invRepo.GetLastInvoices();
                string lastNo = lastInv.Select(x => x.InvoiceNo).FirstOrDefault();
                char lastDigitChar = lastNo.Substring(lastNo.Length - 1, 1)[0];
                int lastDigit = int.Parse(lastDigitChar.ToString());
                model.InvoiceNo = "IN000" + (lastDigit + 1);
                var save = _invRepo.SaveInvoice(model);
                result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.messageUI = "Submit Failed";
                result.messageConsole = ex.Message;
            }
            return Json(result);
        }

        [HttpGet]
        public string ReadInvoice(string InvoiceNo)
        {
            RespInvoiceDetail result = new RespInvoiceDetail();
            try
            {

                if (!string.IsNullOrEmpty(InvoiceNo))
                {
                    List<RespInvDetail> details = new List<RespInvDetail>();
                    var dataHeader = _invRepo.GetInvoiceHeaderByNo(InvoiceNo);
                    if (dataHeader != null && dataHeader.InvoiceNo == InvoiceNo)
                    {
                        var detail = _invRepo.GetDetailsInvoiceByInvNo(InvoiceNo);
                        foreach (var item in detail)
                        {
                            var data = new RespInvDetail
                            {
                                InvoiceNo = item.InvoiceNo,
                                Price = item.Price,
                                ProductID = item.ProductID,
                                ProductName = item.ProductName,
                                Qty = item.Qty,
                                Weight = Convert.ToInt32(item.Weight),
                                Total = item.Qty * item.Price

                            };
                            details.Add(data);
                        }

                        result.InvoiceDate = dataHeader.InvoiceDate;
                        result.InvoiceNo = dataHeader.InvoiceNo;
                        result.InvoiceTo = dataHeader.InvoiceTo;
                        result.ShipTo = dataHeader.ShipTo;
                        result.SalesID = dataHeader.SalesID;
                        result.CourierID = dataHeader.CourierID;
                        result.CourierFee = dataHeader.CourierFee;
                        result.PaymentType = dataHeader.PaymentType;
                        result.is_ok = true;
                        result.dataDetail = details;
                    }
                }
                else
                {
                    result.is_ok = false;
                }
            }
            catch (Exception ex)
            {
                result.is_ok = false;
            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpDelete]
        public string DeleteInvoice(string InvoiceNo)
        {
            RespDeleteInvoice result = new RespDeleteInvoice();
            try
            {
                if (!string.IsNullOrEmpty(InvoiceNo))
                {
                    var detail = _invRepo.DeleteAsync(InvoiceNo);
                    result.is_ok = true;
                }
            }
            catch (Exception ex)
            {
                result.is_ok = true;
            }
            return JsonConvert.SerializeObject(result);
        }
    }
}
