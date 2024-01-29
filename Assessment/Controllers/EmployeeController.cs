using Assessment.Data.dto;
using Assessment.Data.Repository;
using Assessment.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Assessment.Controllers
{
    public class EmployeeController : Controller
    {
        private readonly EmployeeRepo _empRepo;
        public EmployeeController(EmployeeRepo repo)
        {
            _empRepo = repo;
        }
        public IActionResult Employees()
        {
            return View();
        }

        [HttpPost]
        public JsonResult SubmitEmployee(ParamSaveEmployee model)
        {
            RespSaveInvoice result = new RespSaveInvoice();
            try
            {

                if (model.birth_date != null && DateTime.Now.Year - model.birth_date.Year <= 15)
                {
                    result.is_ok = false;
                    result.messageUI = "age must be more than 15 years old";
                    return Json(result);
                }

                if (!string.IsNullOrEmpty(model.nik))
                {
                    var sameNIK = _empRepo.GetNIKEmployee(model.nik);
                    if (!string.IsNullOrEmpty(sameNIK))
                    {
                        result.is_ok = false;
                        result.messageUI = "nik already registered, please type other nik";
                        return Json(result);
                    }
                }

                if (!string.IsNullOrEmpty(model.name) && model.name.Length > 30)
                {
                    result.is_ok = false;
                    result.messageUI = "length name cannot more than 30, please type other name";
                    return Json(result);
                }

                if (!string.IsNullOrEmpty(model.address) && model.address.Length > 200)
                {
                    result.is_ok = false;
                    result.messageUI = "length address cannot more than 200, please type other address";
                    return Json(result);
                }

                var save = _empRepo.SaveEmployee(model);
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

        [HttpPut]
        public JsonResult EditEmployee(ParamUpdateEmployee model)
        {
            RespSaveInvoice result = new RespSaveInvoice();
            try
            {

                if (model.birth_date != null && DateTime.Now.Year - model.birth_date.Year <= 15)
                {
                    result.is_ok = false;
                    result.messageUI = "age must be more than 15 years old";
                    return Json(result);
                }

                
                if (!string.IsNullOrEmpty(model.name) && model.name.Length > 30)
                {
                    result.is_ok = false;
                    result.messageUI = "length name cannot more than 30, please type other name";
                    return Json(result);
                }

                if (!string.IsNullOrEmpty(model.address) && model.address.Length > 200)
                {
                    result.is_ok = false;
                    result.messageUI = "length address cannot more than 200, please type other address";
                    return Json(result);
                }

                var save = _empRepo.EditEmployee(model);
                result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.messageUI = "Edit Failed";
                result.messageConsole = ex.Message;
            }
            return Json(result);
        }

        [HttpGet]
        public string GetEmployeeById(long id)
        {
            RespEmployee result = new RespEmployee();
            try
            {
                var emp = _empRepo.GetListEmployee(string.Empty,id).FirstOrDefault();
                if(emp.ID == 0)
                {
                    result.message = "employee not found";
                    result.is_ok = false;
                    return JsonConvert.SerializeObject(result);
                }
                
                result.ID = emp.ID;
                result.name = emp.name;
                result.birth_date = emp.birth_date;
                result.nik = emp.nik;
                result.sallary = emp.sallary;
                result.address = emp.address;
                result.message = "success";
                result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.message = "Edit Failed";
               
            }
            return JsonConvert.SerializeObject(result);
        }

        [HttpGet]
        public string GetListEmployee(string name)
        {
            RespEmployee result = new RespEmployee();
            try
            {
                //var emp = _empRepo.GetListEmployee(string.Empty, id).FirstOrDefault();
                //if (emp.ID == 0)
                //{
                //    result.message = "employee not found";
                //    result.is_ok = false;
                //    return JsonConvert.SerializeObject(result);
                //}

                //result.ID = emp.ID;
                //result.name = emp.name;
                //result.birth_date = emp.birth_date;
                //result.nik = emp.nik;
                //result.sallary = emp.sallary;
                //result.address = emp.address;
                //result.message = "success";
                //result.is_ok = true;

            }
            catch (Exception ex)
            {
                result.is_ok = false;
                result.message = "Edit Failed";

            }
            return JsonConvert.SerializeObject(result);
        }
    }
}
