using Assessment.Data.DataAccess;
using Assessment.Data.dto;
using Assessment.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace Assessment.Data.Repository
{
    public class InvoiceRepo
    {
        private readonly IsqlDataAccess _dataAccess;
        private readonly IConfiguration _configuration;
        public InvoiceRepo(IsqlDataAccess db, IConfiguration configuration)
        {
            _dataAccess = db;
            _configuration = configuration;
        }

        public List<msproduct> GetProductList()
        {
            var data = GetAllProduct().Result.ToList();
            return data;
        }
        private async Task<IEnumerable<msproduct>> GetAllProduct()
        {
            string query = "select * from msproduct";
            return await _dataAccess.GetData<msproduct, dynamic>(query, new { });
        }
        public List<mscourier> GetCourierList()
        {
            var data = GetAllCourier().Result.ToList();
            return data;
        }
        private async Task<IEnumerable<mscourier>> GetAllCourier()
        {
            string query = "select * from mscourier";
            return await _dataAccess.GetData<mscourier, dynamic>(query, new { });
        }
        public List<mspayment> GetPaymentList()
        {
            var data = GetAllPayments().Result.ToList();
            return data;
        }
        private async Task<IEnumerable<mspayment>> GetAllPayments()
        {
            string query = "select * from mspayment";
            return await _dataAccess.GetData<mspayment, dynamic>(query, new { });
        }
        public List<mssales> GetSales()
        {
            var data = GetAllSales().Result.ToList();
            return data;
        }
        private async Task<IEnumerable<mssales>> GetAllSales()
        {
            string query = "select * from mssales";
            return await _dataAccess.GetData<mssales, dynamic>(query, new { });
        }

        public async Task<bool> SaveInvoice(ParamSaveInvoice data)
        {
            bool result = false;
            try
            {

                decimal feeCourier = 0;
                string query = string.Empty;

                if (data.CourierID > 0)
                {
                    foreach (var detail in data.dataDetail)
                    {
                        var paramCourier = new ParamCourierFee
                        {
                            CourierID = data.CourierID,
                            kg = detail.Weight
                        };
                        var getDataFee = GetCourierFee(paramCourier);
                        if (getDataFee.Result.Count > 0)
                            feeCourier += getDataFee.Result.Sum(x => x.Price);
                        else feeCourier += 14000;
                    }
                    data.CourierFee = feeCourier;

                    var param = new Dictionary<string, object> {
                    { "invoiceno", data.InvoiceNo },
                    { "date", data.InvoiceDate },
                    { "to", data.InvoiceTo },
                    { "shipto", data.ShipTo },
                    { "salesid" ,data.SalesID },
                    {"courierid", data.CourierID },
                    {"paymenttype", data.PaymentType },
                    {"courierfee",feeCourier }
                    };
                    query = @"insert into trinvoice (InvoiceNo,InvoiceDate, InvoiceTo, ShipTo, SalesID, CourierID, PaymentType, CourierFee) 
                                values (@invoiceno,@date,@to,@shipto,@salesid,@courierid,@paymenttype,@courierfee)";
                    await _dataAccess.SaveData(query, param);
                    foreach (var detail in data.dataDetail)
                    {
                       var paramDetail = new Dictionary<string, object> {
                            { "invoiceno", data.InvoiceNo },
                            { "prodid", detail.ProductID },
                            { "weight", detail.Weight },
                            { "qty", detail.Qty },
                            { "price" ,detail.Price }
                        };
                        query = @"insert into trinvoicedetail (InvoiceNo, ProductID, Weight, Qty, Price) 
                                values (@invoiceno,@prodid,@weight,@qty,@price)";
                        await _dataAccess.SaveData(query, paramDetail);
                    }
                    result = true;
                }
                //save header


            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        public async Task<List<ltcourierfee>> GetCourierFee(ParamCourierFee param)
        {
            List<ltcourierfee> result = new List<ltcourierfee>();
            var query = string.Empty;
            DataTable dt = new DataTable();

            query = @"select * from ltcourierfee
                      where CourierID=@courier and (StartKg=@kg and EndKg>=@kg)";

            var filter = new Dictionary<string, object> {
                    { "courier", param.CourierID },
                    { "kg", param.kg }
                };

            dt = await _dataAccess.ExecuteDataTable(query, filter);

            result = (from DataRow dr in dt.Rows
                      select new ltcourierfee()
                      {
                          WeightID = !string.IsNullOrEmpty(dr["WeightID"].ToString()) ? int.Parse(dr["WeightID"].ToString()) : 0,
                          CourierID = dr["CourierID"].ToString(),
                          StartKg = dr["StartKg"].ToString(),
                          EndKg = dr["EndKg"].ToString(),
                          Price = !string.IsNullOrEmpty(dr["Price"].ToString()) ? decimal.Parse(dr["Price"].ToString()) : 0
                      }).ToList();

            return result;
        }

        public List<trinvoice> GetLastInvoices()
        {
            var data = GetLastInvoice().Result.ToList();
            return data;
        }
        private async Task<IEnumerable<trinvoice>> GetLastInvoice()
        {
            string query = "select top 1 * from trinvoice order by InvoiceNo desc";
            return await _dataAccess.GetData<trinvoice, dynamic>(query, new { });
        }

        public async Task<bool> EditInvoice(ParamSaveInvoice data)
        {
            bool result = false;
            try
            {

                decimal feeCourier = 0;
                string query = string.Empty;

                if (data.CourierID > 0)
                {
                    foreach (var detail in data.dataDetail)
                    {
                        var paramCourier = new ParamCourierFee
                        {
                            CourierID = data.CourierID,
                            kg = detail.Weight
                        };
                        var getDataFee = GetCourierFee(paramCourier);
                        if (getDataFee.Result.Count > 0)
                            feeCourier += getDataFee.Result.Sum(x => x.Price);
                    }
                    data.CourierFee = feeCourier;

                    var param = new Dictionary<string, object> {
                    { "invoiceno", data.InvoiceNo },
                    { "date", data.InvoiceDate },
                    { "to", data.InvoiceTo },
                    { "shipto", data.ShipTo },
                    { "salesid" ,data.SalesID },
                    {"courierid", data.CourierID },
                    {"paymenttype", data.PaymentType },
                    {"courierfee",feeCourier }
                    };
                    query = @"update  trinvoice set
                                InvoiceDate=@date, 
                                InvoiceTo=@to,
                                ShipTo=@shipto,
                                SalesID=@salesid,
                                CourierID=@courierid,
                                PaymentType=@paymenttype,
                                CourierFee=@courierfee
                                where InvoiceNo=@invoiceno";
                    await _dataAccess.SaveData(query, param);

                    foreach (var detail in data.dataDetail)
                    {
                        var paramDetail = new Dictionary<string, object> {
                            { "invoiceno", data.InvoiceNo },
                            { "prodid", detail.ProductID },
                            { "weight", detail.Weight },
                            { "qty", detail.Qty },
                            { "price" ,detail.Price }
                        };
                        query = @"update  trinvoicedetail InvoiceNo=@invoiceno, ProductID=@prodid, Weight=@weight, Qty=@qty, Price@price 
                                where InvoiceNo=@invoiceno";
                        await _dataAccess.SaveData(query, paramDetail);
                    }
                    result = true;

                }

            }
            catch (Exception ex)
            {
                result = false;
            }
            return result;
        }

        private async Task<IEnumerable<trinvoice>> GetLastInvoiceByNo(string invNo)
        {
            string query = "select top 1 * from trinvoice where InvoiceNo=@invoiceno";
            var param = new Dictionary<string, object> {
                    { "invoiceno", invNo },
                   };
            return await _dataAccess.GetData<trinvoice, dynamic>(query,param);
        }
        public trinvoice GetInvoiceHeaderByNo(string invNo)
        {
            var data = GetLastInvoiceByNo(invNo).Result.ToList().FirstOrDefault();
            return data;
        }

        private async Task<IEnumerable<RespInvDetail>> GetDetailInvoiceByInvNo(string invNo)
        {
            string query = "select  a.*,b.ProductName from trinvoicedetail a" +
                "           left join msproduct b on a.ProductID = b.ProductID where a.InvoiceNo=@invoiceno";
            var param = new Dictionary<string, object> {
                    { "invoiceno", invNo },
                   };
            return await _dataAccess.GetData<RespInvDetail, dynamic>(query, param);
        }

        public List<RespInvDetail> GetDetailsInvoiceByInvNo(string invNo)
        {
            var data = GetDetailInvoiceByInvNo(invNo).Result.ToList();
            return data;
        }

        public async Task<bool> DeleteAsync(string invNo)
        {
            try
            {
                string query = @"delete  from trinvoice where InvoiceNo=@invoiceno";
                var param = new Dictionary<string, object> {
                    { "invoiceno", invNo },
                   };

                await _dataAccess.SaveData(query, param);

                 query = @"delete from trinvoicedetail where InvoiceNo=@invoiceno";
               
                await _dataAccess.SaveData(query, param);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        
    }
}
